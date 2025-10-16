# Importazione moduli
from machine import Pin, ADC, Timer, RTC, reset
from time import sleep, time
import dht, network, json, ubinascii, urandom, urequests, struct, ntptime, utime
import usocket as sk

# Creazione timer
tim = Timer(0)

# Creazione orario
rtc = RTC()

# Funzione caricamento dati
def loadData():
    # Caricamento informazione wifi
    try:
        with open('secrets.json', 'r') as secretsFile:
            secrets = json.load(secretsFile)
    except:
        print("Errore nel caricamento o nella conversione delle informazioni wifi!")
        
    # Caricamento informazioni connessioni
    try:
        with open('connInfo.json', 'r') as connInfoFile:
            connInfo = json.load(connInfoFile)
    except:
        print("Errore nel caricamento o nella conversione delle informazioni per la connessione!")
        
    # Caricamento impostazioni
    try:
        with open('settings.json', 'r') as settingsFile:
            settings = json.load(settingsFile)
    except:
        print("Errore nel caricamento o nella conversione delle impostazioni!")
        
    # Caricamento informazioni
    try:
        with open('info.json', 'r') as infoFile:
            info = json.load(infoFile)
    except:
        print("Errore nel caricamento o nella conversione delle informazioni!")
        
    # Controllo dati
    if (len(secrets) <= 0 or len(connInfo) <= 0 or len(settings) <= 0 or len(info) <= 0):
        print("Riavvio dispositivo per errore nei caricamenti")
        sleep(1)
        reset()
    else:
        return [secrets, connInfo, settings, info]
    
# Funzione sincronizzazione orario
def syncTime():
    try:
        print("\nSincronizzazione orario in corso...")
        # Aggiornamento orario
        ntptime.settime()
        epoch_local = utime.time() + 2 * 3600  # UTC+2
        lt = utime.localtime(epoch_local)
        rtc.datetime((lt[0], lt[1], lt[2], lt[6] + 1, lt[3], lt[4], lt[5], 0))
        print("Orario sincronizzato!\n")
    except Exception as e:
        print("Errore nella sincronizzazione dell'orario!")
        print(e, "\n")


# Funzione connessione wifi
def connWifi(ssid, psw):
    # Configurazione wifi
    wlan = network.WLAN(network.STA_IF)
    wlan.active(True)

    # Connessione wifi
    wlan.connect(ssid, psw)
    print("Connessione al wifi in corso...")

    # Tentativi connessione
    for i in range(10):
        if wlan.isconnected():
            print("Connesso al wifi!")
            break
        sleep(1)
        print(f"Tentativo di connessione {i}")
    return wlan

# Funzione login
def login(api, key, psw):
    
    print("\nAutenticazione dispositivo in corso...")
    
    # Dichiarazione dati
    payload = {"key": key, "psw": psw, "type": "device"}
    headers = {"Content-Type": "application/json"}
    
    # Dichiarazione dati risposta
    resData = None
    
    # Gestione errori
    try:
        # Effettuazione richiesta
        response = urequests.post(
            f"{api}/auth/login",
            data=json.dumps(payload),
            headers=headers
        )
        
        # Controllo richiesta
        if response.text and response.status_code == 200:
            resData = json.loads(response.text)
        else:
            raise Exception("Errore nella richiesta!")

        # Chiusura richiesta
        response.close()
        
        print("Autenticazione dispositivo!\n")
        
        # Ritorno token
        return resData["data"]["accessToken"]
    except Exception as e:
        print("Errore nell'autenticazione del dispositivo!")
        print(e, "\n")
        return None
    
# Funzione connessione socket
def connSocket(api, ip, port, token):
    
    print("\nConnessione al backend in corso...")
    
    # Creazione chiave casuale
    key_bytes = bytes([urandom.getrandbits(8) for _ in range(16)])
    key = ubinascii.b2a_base64(key_bytes).strip().decode()
    
    type_ = "device"

    # Costruzione richiesta
    req = (
        f"GET /?token={token}&type={type_} HTTP/1.1\r\n"
        f"Host: {ip}:{port}\r\n"
        "Upgrade: websocket\r\n"
        "Connection: Upgrade\r\n"
        f"Sec-WebSocket-Key: {key}\r\n"
        "Sec-WebSocket-Version: 13\r\n"
        "\r\n"
    )
    
    # Configurazione socket
    s = sk.socket()
    addr = sk.getaddrinfo(ip, port)[0][-1]

    # Connessione socket
    try:
        s.connect(addr)
        s.send(req.encode())
        
        # Ricevi la risposta dal server
        resp = s.recv(1024)

        # Verifica che la risposta contenga il codice 101 (Switching Protocols)
        if b"101" in resp:
            print("Connesso al backend!\n")
            return s
        else:
            print("Non connesso al backend!")
            s.close()
            return None
    except Exception as e:
        print("Errore nella connessione con il backend!")
        print(e, "\n")
    return s

# Funzione invio messaggi
def ws_send(sock, msg):
    payload = msg.encode()
    payload_len = len(payload)

    # Header del frame
    header = bytearray()
    header.append(0x81)  # FIN + opcode text frame

    # Gestione lunghezza
    if payload_len <= 125:
        header.append(0x80 | payload_len)  # mascherato + lunghezza
    elif payload_len <= 65535:
        header.append(0x80 | 126)  # mascherato + 126 = lunghezza estesa 16bit
        header.extend(struct.pack(">H", payload_len))
    else:
        header.append(0x80 | 127)  # mascherato + 127 = lunghezza estesa 64bit
        header.extend(struct.pack(">Q", payload_len))

    # Maschera (4 byte)
    mask = bytes([urandom.getrandbits(8) for _ in range(4)])
    header.extend(mask)

    # Applica maschera al payload
    masked_payload = bytes(b ^ mask[i % 4] for i, b in enumerate(payload))

    # Invia frame completo
    sock.send(header + masked_payload)
    
def ws_recv(sock, timeout=2):
    sock.settimeout(timeout)  # timeout in secondi
    try:
        header = sock.recv(2)
        if not header:
            return None

        fin_opcode = header[0]
        masked_len = header[1]
        length = masked_len & 0x7F

        if length == 126:
            ext = sock.recv(2)
            length = struct.unpack(">H", ext)[0]
        elif length == 127:
            ext = sock.recv(8)
            length = struct.unpack(">Q", ext)[0]

        payload = sock.recv(length)

        # Decodifica e restituisce
        try:
            text = payload.decode()
            return json.loads(text)
        except:
            return payload

    except Exception as e:
        # Nessun messaggio o errore di timeout
        if "ETIMEDOUT" in str(e) or "timeout" in str(e):
            return None
        else:
            print("Errore in ws_recv:", e)
            return None

    
# Caricamento dati
[secrets, connInfo, settings, info] = loadData()

# Connessione wifi
wlan = connWifi(secrets["ssid"], secrets["psw"])

# Sincronizzazione orario
syncTime()

# Effettuazione login
token = login(connInfo["api_url"], info["key"], info["psw"])

# Connessione socket
sock = connSocket(connInfo["api_url"], connInfo["sk_ip"], connInfo["sk_port"], token)

# Dichiarazione pompa
pump = Pin(26, Pin.OUT)

# Dichiarazione sensore suolo
sensor = ADC(Pin(32))
sensor.atten(ADC.ATTN_11DB)
sensor.width(ADC.WIDTH_12BIT)

# Dichiarazione sensore esterno
sensorOut = dht.DHT11(Pin(33))

# Dichiarazione sensore luminosità
sensorLum = ADC(Pin(35))
sensorLum.atten(ADC.ATTN_11DB)
sensorLum.width(ADC.WIDTH_12BIT)

# Funzione calcolo irrigazione
def irrigation(humI = None, humMax = None, interval = None, duration = None):
    # Dichiarazione tempo irrigazione
    irrigationTime = 0
    
    # Controllo dati
    if duration:
        # Definizione tempo irrigazione
        irrigationTime = duration
    elif humI and humMax and interval:
        # Definizione tempo irrigazione
        irrigationTime = round(((humMax - humI) * interval))
    
    if irrigationTime >= 0:
        pump.on()
        print(f"Irrigazione per {duration}s")
        # tim.init(mode=Timer.ONE_SHOT, period=round(((humMax - humI) * interval) * 1000), callback=lambda t: pump.off())
        sleep(irrigationTime)
        pump.off()

# Funzione calcolo misurazioni
def measure(sensor, n=10):
    total = 0
    for _ in range(n):
        total += sensor.read()
    return total / n

# Funzione invio misurazioni
def sendMeasurement (api, token, humI, humE, temp, lum, date, mode):
    # Dichiarazione tipo di log
    logType = "log_info"
    
    # Controllo modalità
    if mode == "config":
        logType = "data_config"
    elif mode == "auto":
        logType = "data_auto"
    
    # Dichiarazione dati
    payload = {"desc": "Misurazione dati con sensori", "date": date, "humI": humI, "humE": humE, "temp":temp, "lum":lum, "type": logType}
    headers = {"Content-Type": "application/json", "Authorization":f"Bearer {token}"}
    
    # Dichiarazione dati risposta
    resData = None
    
    # Gestione errori
    try:
        # Effettuazione richiesta
        response = urequests.post(
            f"{api}/api/data",
            data=json.dumps(payload),
            headers=headers
        )
        
        # Controllo richiesta
        if response.text and response.status_code == 200:
            resData = json.loads(response.text)
        else:
            raise Exception("Errore nella richiesta!")
        
        # Chiusura richiesta
        response.close()
        
        # Ritorno dati
        return None
    except Exception as e:
        print(e)
        return None


# Funziona scrittura misurazioni
def printMeasurement (humI, humE, temp, lum):
    print(f"Umidità Interna: {round(humI)}%")
    print(f"Umidità Esterna: {humE}%")
    print(f"Temperatura: {temp}°C")
    print(f"Luminosità: {round(lum)}%")

# Loop principale
def mainLoop () :
    # Ricezione evento
    event = ws_recv(sock, 0.1)
    
    # Controllo evento
    if type(event) is dict and "event" in event:
        # Gestore evento irrigazione
        if event["event"] == "irrigation" and "duration" in event:
            # Effettuazione irrigazione
            irrigation(duration=event["duration"])
    
    # Calcolo humI
    humI = measure(sensor, 50) / 4095 * 100
    lum = 100 - (measure(sensorLum, 50) / 4095 * 100)

    # Calcolo humE e temp
    try:
        sensorOut.measure()
        temp = sensorOut.temperature()
        humE = sensorOut.humidity()
    except Exception as e:
        print("Errore DHT:", e)
        temp = None
        humE = None
        
    currentTime = f"{rtc.datetime()[0]:04d}-{rtc.datetime()[1]:02d}-{rtc.datetime()[2]:02d}T{rtc.datetime()[4]:02d}:{rtc.datetime()[5]:02d}:{rtc.datetime()[6]:02d}"
    print(currentTime)
    
    # Controllo modalità config
    if info["mode"] == "config":
        printMeasurement(humI, humE, temp, lum)
    # Controllo modalità auto
    elif info["mode"] == "auto":
        printMeasurement(humI, humE, temp, lum)
        if settings["humMin"] > humI:
            irrigation(humI, settings["humMax"], settings["interval"])
    
    # Gestore errore invio dati
    try:
        # Controllo socket
        if sock:
            # Invio stato
            ws_send(sock, json.dumps({"event": "status", "data":{"lastSeen":currentTime}}))
                    
        # Controllo dati
        if humI is not None and humE is not None and temp is not None and lum is not None and token and info["mode"] != "dev":
            # Invio misurazioni
            sendMeasurement(connInfo["api_url"], token, humI, humE, temp, lum, currentTime, info["mode"])
    except Exception as e:
        print("Errore nell'invio dei dati!")
        print(e)
    
    # Attesa
    print("\n\n")
    sleep(4)

# Esecuzione script
if __name__ == "__main__":
   while True:
       mainLoop()