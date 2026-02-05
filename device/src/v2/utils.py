# Importazione moduli
from machine import Timer, reset
import network, json, ubinascii, urandom, urequests, struct, ntptime, utime
from time import sleep
import usocket as sk

# Funzione caricamento dati
def loadData():
    secrets = {}
    connInfo = {}
    settings = {}
    info = {}
    # Caricamento informazione wifi
    try:
        with open('secrets.json', 'r') as secretsFile:
            secrets = json.load(secretsFile)
    except:
        print("Error loading wifi info")
        
    # Caricamento informazioni connessioni
    try:
        with open('connInfo.json', 'r') as connInfoFile:
            connInfo = json.load(connInfoFile)
    except:
        print("Error loading connection info")
        
    # Caricamento impostazioni
    try:
        with open('settings.json', 'r') as settingsFile:
            settings = json.load(settingsFile)
    except:
        print("Error loading settings")
        
    # Caricamento informazioni
    try:
        with open('info.json', 'r') as infoFile:
            info = json.load(infoFile)
    except:
        print("Error loading device info")
        
    # Controllo dati
    if (len(secrets) <= 0 or len(connInfo) <= 0 <= 0 or len(info) <= 0):
        print("Device restart for loading errors")
        sleep(1)
        reset()
    else:
        return [secrets, connInfo, settings, info]

# Funzione caricamento impostazioni
def getSettings(api: str, token: str):
    # Ritorno dati
    return getHandler(f"{api}/me/device-settings?authType=device", "settings", token)
    
# Funzione sincronizzazione orario
def syncTime(rtc):
    try:
        print("\nTime sync...")
        # Aggiornamento orario
        ntptime.settime()
        epoch_local = utime.time() + 2 * 3600  # UTC+2
        lt = utime.localtime(epoch_local)
        rtc.datetime((lt[0], lt[1], lt[2], lt[6] + 1, lt[3], lt[4], lt[5], 0))
        print("Time sync success\n")
    except Exception as e:
        print("Time sync error: ", e, "\n")

# Funzione connessione wifi
def connWifi(ssid: str, psw: str):

    # Configurazione wifi
    wlan = network.WLAN(network.STA_IF)
    wlan.active(True)

    # Connessione wifi
    wlan.connect(ssid, psw)
    print("\nWifi connection...")

    # Tentativi connessione
    for i in range(10):
        if wlan.isconnected():
            print("Wifi connection success")
            break
        sleep(1)
        print(f"Wifi tentative {i}")
    return wlan

# Funzione login
def login(auth: str, key: str, psw: str):
    # Dichiarazione dati
    payload = {"key": key, "psw": psw}
    
    # Ritorno dati
    return postHandler(f"{auth}/device-login?authType=device", payload, "login")

# Funzione connessione socket
def connSocket(ip: str, port: int, token: str):
    print("\nWS connection...")
    
    # Creazione chiave casuale
    key_bytes = bytes([urandom.getrandbits(8) for _ in range(16)])
    key = ubinascii.b2a_base64(key_bytes).strip().decode()

    # Costruzione richiesta
    req = (
        f"GET /?token={token}&authType=device&v=1 HTTP/1.1\r\n"
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

        # Controllo codice 101
        if b"101" in resp:
            print("WS connection success\n")
            return s
        else:
            print("WS connection failed\n")
            s.close()
            return None
    except Exception as e:
        print("WS connection error", e, "\n")
    return s

# Funzione invio messaggi
def ws_send(sock, msg: str):
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

# Funzione ricezione messaggi
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
            print("WS receiver error", e, "\n")
            return None
        
# Funzione irrigazione
def irrigation(pump, name: str, mode: str, date, token: str, api: str, sensor, sensorLum, sensorOut, humI = None, humMax = None, interval = None, duration = None):
    # Dichiarazione tempo irrigazione
    irrigationTime = 0
    
    # Creazione timer
    # tim = Timer(1)
    
    # Controllo dati
    if duration:
        # Definizione tempo irrigazione
        irrigationTime = duration
    elif humI and humMax and interval:
        # Definizione tempo irrigazione
        irrigationTime = round(((humMax - humI) * interval))
    
    # Calcolo humI1
    humI1 = measure(sensor, 50) / 4095 * 100
    
    def pumpOff (humI1):
        pump.off()
        
        # Dichiarazione humI2
        humI2 = 0
        
        while humI2 <= 0:
            # Calcolo humI2
            humI2 = measure(sensor, 50) / 4095 * 100
            lum = measure(sensorLum, 50) / 4095 * 100

        # Calcolo humE e temp
        try:
            sensorOut.measure()
            temp = sensorOut.temperature()
            humE = sensorOut.humidity()
        except Exception as e:
            print("DHT error:", e)
            temp = None
            humE = None
            
        # Dichiarazione payload
        payload = {}

        # Inizializzazione url richiesta
        reqUrl = ""

        # Inizializzazione nome richiesta
        reqName = ""
        
        # Controllo variazione umidità
        if humI2 < (humMax * 80/100):
            # Dichiarazione dati
            payload = {"title":"ERRORE IRRIGAZIONE!", "description": f"Irrigazione di {irrigationTime}s del dispositivo {name} non effettuata correttamente, controllare tanica d'acqua!", "type": "error"}

            # Dichiarazione url richiesta
            reqUrl = "notifications?authType=device"

            # Dichiarazione nome richiesta
            reqName = "notification"
        else:
            # Dichiarazione dati
            payload = {"irrigatedAt": date, "interval": irrigationTime, "type": mode, "humIBefore": humI1, "humIAfter": humI2, "humE": humE, "lum": lum, "temp": temp}

            # Dichiarazione url richiesta
            reqUrl = "irrigations?authType=device"

            # Dichiarazione nome richiesta
            reqName = "irrigation"

        # Ritorno dati
        return postHandler(f"{api}/{reqUrl}", payload, reqName, token)
    
    if irrigationTime > 0:
        pump.on()
        print(f"Irrigation for {irrigationTime}s")
        # tim.init(mode=Timer.ONE_SHOT, period=irrigationTime * 1000, callback=lambda t: pumpOff())
        sleep(irrigationTime)
        pumpOff(humI1)

# Funzione calcolo misurazioni
def measure(sensor, n=10):
    total = 0
    for _ in range(n):
        total += sensor.read()
    return total / n

# Funzione invio misurazioni
def sendMeasurement (api: str, token: str, humI: float, humE: float, temp: float, lum: float, date): 

    # Controllo dati
    if humI is None or humE is None or temp is None or lum is None or not token:
        print("Invalid measurements\n")
        return None

    # Dichiarazione dati
    payload = {"measuredAt": date, "humI": humI, "humE": humE, "temp":temp, "lum":lum}

    # Ritorno dati
    return postHandler(f"{api}/measurements?authType=device", payload, "measurements", token)

# Funzione invio avvisi
def sendNotifications (title: str, description: str, _type: str):
    
    # Dichiarazione dati
    payload = {"title": title, "description": description, "type": _type}

    # Ritorno dati
    return postHandler(f"{api}/notifications?authType=device", payload, "notifications", token)

# Funziona scrittura misurazioni
def printMeasurement (humI: float, humE: float, temp: float, lum:float):
    print(f"Internal humidity: {round(humI)}%")
    print(f"External humidity: {humE}%")
    print(f"Temperature: {temp}°C")
    print(f"Luminosity: {round(lum)}%")

# Funzione gestione richieste get
def getHandler(url, name, token = None) :
    print(f"Get request: {name}...")

    # Controllo token
    if token:
        # Dichiarazione headers
        headers = {"Content-Type": "application/json", "Authorization":f"Bearer {token}", "user-agent":"esp32 - Solaris Vega"}
    else:
        # Dichiarazione headers
        headers = {"Content-Type": "application/json", "user-agent":"esp32 - Solaris Vega"}
    
    # Dichiarazione dati risposta
    resData = None
    
    # Gestione errori
    try:
        # Effettuazione richiesta
        response = urequests.get(url,
            headers=headers
        )
        
        # Controllo richiesta
        if response.text:
            resData = json.loads(response.text)
            if response.status_code != 200:
                raise Exception(resData["message"])
        else:
            raise Exception()

        # Chiusura richiesta
        response.close()
        
        print(f"Get request success: {name}\n")
        
        # Ritorno dati
        return resData["data"]
    except Exception as e:
        print(f"Get request error: {name}",e, "\n")
        return None
    
# Funzione gestione richieste get
def postHandler(url, payload, name, token = None):
    print(f"Post request: {name}...")

    # Controllo token
    if token:
        # Dichiarazione headers
        headers = {"Content-Type": "application/json", "Authorization":f"Bearer {token}", "user-agent":"esp32 - Solaris Vega"}
    else:
        # Dichiarazione headers
        headers = {"Content-Type": "application/json", "user-agent":"esp32 - Solaris Vega"}

    # Dichiarazione dati risposta
    resData = None
    
    # Gestione errori
    try:
        # Effettuazione richiesta
        response = urequests.post(
            url,
            data=json.dumps(payload),
            headers=headers
        )
        
        # Controllo richiesta
        if response.text:
            resData = json.loads(response.text)
            if response.status_code != 200:
                raise Exception(resData["message"])
        else:
            raise Exception()
        
        # Chiusura richiesta
        response.close()

        print(f"Post request success: {name}\n")
        
        # Ritorno dati
        return resData["data"]
    except Exception as e:
        print(f"Post request error: {name}", e, "\n")
        return None

