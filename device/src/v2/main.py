# Importazione moduli
from machine import Pin, ADC, Timer, RTC, reset, PWM
import usocket as sk
from time import sleep, sleep_ms
import dht, network, json, ubinascii, urandom, urequests, struct, ntptime, utime

# Dichiarazione stato dispositivo
deviceState = {}

# Impostazione flags
deviceState["flags"] = {"measure": False, "irrigate": False, "irrigationInfo": None}

# Classe errore critico
class CriticalError(Exception):
    pass

# Classe errore non bloccante
class TransientError(Exception):
    pass

# --- 

# Funzione gestione richieste get
def getHandler(url: str, name: str, token = None) :
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
    
# Funzione gestione richieste post
def postHandler(url: str, payload: dict, name: str, token = None):
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
            data=json.dumps(payload).encode("utf-8"),
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

# Funzione invio avvisi
def sendNotifications (title: str, description: str, _type: str):
    try:
        # Dichiarazione dati
        payload = {"title": title, "description": description, "type": _type}

        # Ritorno dati
        return postHandler(f'{deviceState["serverInfo"]["apiUrl"]}/notifications?authType=device', payload, "notifications", deviceState["token"])
    except Exception as e:
        raise CriticalError(e)

# Funzione invio irrigazione
def sendIrrigations (date, irrigationTime: int, _type: str, humIBefore: float, humIAfter: float, humE: float, lum: float, temp: float):
    try:
        # Dichiarazione dati
        payload = {"irrigatedAt": date, "interval": irrigationTime, "type": _type, "humIBefore": humIBefore, "humIAfter": humIAfter, "humE": humE, "lum": lum, "temp": temp}

        # Ritorno dati
        return postHandler(f'{deviceState["serverInfo"]["apiUrl"]}/irrigations?authType=device', payload, "irrigation", deviceState["token"])
    except Exception as e:
        raise CriticalError(e)

# Funzione invio misurazioni
def sendMeasurements (humI: float, humE: float, temp: float, lum: float, date):
    try:
        # Dichiarazione dati
        payload = {"measuredAt": date, "humI": humI, "humE": humE, "temp":temp, "lum":lum}

        # Ritorno dati
        return postHandler(f'{deviceState["serverInfo"]["apiUrl"]}/measurements?authType=device', payload, "measurements", deviceState["token"])
    except Exception as e:
        raise CriticalError(e)

# Funzione login
def login():
    try:
        # Dichiarazione dati
        payload = {"key": deviceState["info"]["key"], "psw": deviceState["info"]["psw"]}
        
        # Ritorno dati
        return postHandler(f'{deviceState["serverInfo"]["authUrl"]}/device-login?authType=device', payload, "login")
    except Exception as e:
        raise CriticalError(e)

# Funzione richiesta impostazioni
def getSettings():
    try:
        # Ritorno dati
        return getHandler(f'{deviceState["serverInfo"]["apiUrl"]}/me/device-settings?authType=device', "settings", deviceState["token"])
    except Exception as e:
        raise CriticalError(e)

# ---

# Funzione mappatura
def mapRange(x, in_min, in_max, out_min, out_max):
    # Controllo valori
    if in_max == in_min:
        raise TransientError("Range map failed (cannot divide by 0)")

    return (x - in_min) * (out_max - out_min) // (in_max - in_min) + out_min

# ---

# Funzione caricamento dati
def loadData():
    try:
        wifiInfo = {}
        serverInfo = {}
        settings = {}
        deviceInfo = {}
        
        # Caricamento informazione wifi
        with open('wifiInfo.json', 'r') as wifiFile:
            wifiInfo = json.load(wifiFile)
            
        # Caricamento informazioni connessioni
        with open('serverInfo.json', 'r') as apiFile:
            serverInfo = json.load(apiFile)
            
        # Caricamento impostazioni
        with open('settings.json', 'r') as settingsFile:
            settings = json.load(settingsFile)
            
        # Caricamento informazioni
        with open('deviceInfo.json', 'r') as deviceFile:
            deviceInfo = json.load(deviceFile)
            
        # Ritorno dati
        return [wifiInfo, serverInfo, settings, deviceInfo]
    except Exception as e:
        raise CriticalError(e)

# Funzione sincronizzazione orario
def syncTime():
    for attempt in range(5):
        try:
            print("\nTime sync...")

            # Aggiornamento orario
            ntptime.settime()
            epoch_local = utime.time() + 1 * 3600
            lt = utime.localtime(epoch_local)
            deviceState["utils"]["rtc"].datetime((lt[0], lt[1], lt[2], lt[6]+1, lt[3], lt[4], lt[5], 0))
            print("Time sync success\n")
            return
        except OSError as e:
            print(f"Time sync attempt {attempt+1} failed: {e}")
            sleep(1)
    raise TransientError("Time sync failed after retries")

# Funzione connessione wifi
def connWifi():
    try:
        # Configurazione wifi
        wlan = network.WLAN(network.STA_IF)
        wlan.active(True)

        # Connessione wifi
        wlan.connect(deviceState["wifiInfo"]["ssid"], deviceState["wifiInfo"]["psw"])
        print("\nWifi connection...")

        # Tentativi connessione
        for i in range(10):
            # Controllo connessione
            if wlan.isconnected():
                print("Wifi connection success")
                return

            sleep(1)
            print(f"Wifi tentative {i}")
        
        raise Exception("Wifi connection failed")
    except Exception as e:
        raise CriticalError(e)

# Funzione configurazione sensori
def sensorConfig():
    # Dichiarazione pin led
    pwmPins = [27,13,12]
    pwms = [PWM(Pin(pwmPins[0])),PWM(Pin(pwmPins[1])), PWM(Pin(pwmPins[2]))]
    [pwm.freq(1010) for pwm in pwms]

    # Dichiarazione pompa
    pump = Pin(26, Pin.OUT)

    # Dichiarazione sensore suolo
    sensorIn = ADC(Pin(32))
    sensorIn.atten(ADC.ATTN_11DB)
    sensorIn.width(ADC.WIDTH_12BIT)

    # Dichiarazione sensore esterno
    sensorOut = dht.DHT22(Pin(33))

    # Dichiarazione sensore luminosità
    sensorLum = ADC(Pin(35))
    sensorLum.atten(ADC.ATTN_11DB)
    sensorLum.width(ADC.WIDTH_12BIT)

    # Creazione timer
    tim1 = Timer(0)

    # Creazione timer
    tim2 = Timer(1)

    # Creazione orario
    rtc = RTC()

    # Impostazione dati
    deviceState["sensors"] = {"pump":pump, "sensorIn":sensorIn, "sensorOut":sensorOut, "sensorLum":sensorLum}
    deviceState["utils"] = {"rtc":rtc, "tim1":tim1, "tim2":tim2, "pwms":pwms}

# Funzione configurazione
def config():
    # Caricamento dati
    [deviceState["wifiInfo"], deviceState["serverInfo"], deviceState["settings"], deviceState["info"]] = loadData()

    # Connessione wifi
    connWifi()

    try:
        # Sincronizzazione orario
        syncTime()
    except Exception:
        print("Time sync failed")

    # Effettuazione login
    loginData = login()

    # Controllo dati
    if loginData:
        # Impostazione token e nuove info dispositivo
        deviceState["token"] = loginData["accessToken"]
        newDevice = loginData["device"]
    else:
        # Ritorno errore
        raise Exception("Login failed")

    # Controllo nuove info dispositivo
    if newDevice != "":
        # Conversione dispositivo
        parsedInfo = {"id":newDevice["id"], "key":deviceState["info"]["key"], "psw":deviceState["info"]["psw"], "name": newDevice["name"], "prototypeModel":newDevice["prototypeModel"]}
        
        # Sovrascrittura file
        with open("deviceInfo.json", "w") as infoFile:
            infoFile.write(json.dumps(parsedInfo))
            deviceState["info"] = parsedInfo

    # Richiesta impostazioni
    newSettings = getSettings()

    # Controllo impostazioni
    if newSettings:
        # Conversione impostazioni
        parsedSettings = json.dumps(newSettings)
        
        # Sovrascrittura file
        with open("settings.json", "w") as settingsFile:
            settingsFile.write(parsedSettings)
            deviceState["settings"] = newSettings

    # Connessione socket
    sock = connSocket()

    # Controllo socket
    if not sock:
        # Ritorno errore
        raise Exception("Socket connection failed")

    # Impostazione connesione socket
    deviceState["sock"] = sock

# ---

# Funzione misurazione dht
def dhtMeasure():
    for _ in range(3):
        try:
            deviceState["sensors"]["sensorOut"].measure()
            return deviceState["sensors"]["sensorOut"].humidity(), deviceState["sensors"]["sensorOut"].temperature()
            break
        except OSError:
            sleep_ms(200)
    else:
        raise TransientError("DHT22 read failed")

# Funzione calcolo misurazioni
def measure(sensor, n=10, delay_ms=10):
    # Calcolo somma letture
    total = 0
    for _ in range(n):
        total += sensor.read()
        sleep_ms(delay_ms)
    
    # Calcolo media letture
    return total / n

# Funzione controllo misurazioni
def measurementsCheck(humI: float, humE: float, lum: float, temp: float):
    # Controllo humI
    if humI is None or humI < 0 or humI > 100:
        # Ritorno errore
        raise CriticalError("Soil humidity measurement invalid")

    # Controllo humE
    if humE is None or humE < 0 or humE > 100:
        # Ritorno errore
        raise CriticalError("External humidity measurement invalid")

    # Controllo temp
    if temp is None:
        # Ritorno errore
        raise TransientError("Temperature measurement invalid")

    # Controllo temp
    if lum is None or lum < 0 or lum > 100:
        # Ritorno errore
        raise Exception("Luminosity measurement invalid")

# Funzione controllo misurazioni sicure
def secureMeasurementsCheck(temp: float, humE: float):
    # Controllo temperatura
    if temp <= 2:
        # Invio avviso
        sendNotifications("TEMPERATURA BASSA", "La temperatura della tua serra è inferiore ai 2 gradi, questo potrebbe danneggiare le tue coltivazioni!", "warning")
    elif temp >= 30:
        # Invio avviso
        sendNotifications("TEMPERATURA ALTA", "La temperatura della tua serra è superiore ai 30 gradi, questo potrebbe danneggiare le tue coltivazioni!", "warning")
        
    # Controllo umidità esterna
    if humE <= 30:
        # Invio avviso
        sendNotifications("UMIDITA' BASSA", "L'umidità esterna della tua serra è inferiore al 30%, questo potrebbe danneggiare le tue coltivazioni!", "warning")
    elif humE >= 85:
        # Invio avviso
        sendNotifications("UMIDITA' ALTA", "L'umidità esterna della tua serra è superiore al 85%, questo potrebbe danneggiare le tue coltivazioni!", "warning")

# Funzione misurazione con controllo modalità
def measurementsMode(humI: float, humE: float, lum: float, temp: float):
    # Dichiarazione tempo corrente
    currentTime = f'{deviceState["utils"]["rtc"].datetime()[0]:04d}-{deviceState["utils"]["rtc"].datetime()[1]:02d}-{deviceState["utils"]["rtc"].datetime()[2]:02d}T{deviceState["utils"]["rtc"].datetime()[4]:02d}:{deviceState["utils"]["rtc"].datetime()[5]:02d}:{deviceState["utils"]["rtc"].datetime()[6]:02d}'

    # Controllo modalità config
    if deviceState["settings"]["mode"] == "config" and deviceState["token"]:
        # Stampo misurazioni
        printMeasurement(humI, humE, temp, lum)
        # Invio misurazioni
        sendMeasurements(humI, humE, temp, lum, currentTime)
    # Controllo modalità auto
    elif deviceState["settings"]["mode"] == "auto" and deviceState["token"]:
        # Stampo misurazioni
        printMeasurement(humI, humE, temp, lum)
        # Controllo umidità minima
        if deviceState["settings"]["humIMin"] > humI:
            # Irrigazione
            irrigationAuto(currentTime, humI)
        else:
            # Invio misurazioni
            sendMeasurements(humI, humE, temp, lum, currentTime)

# Funzione misurazioni
def measurements():
    # Impostazione colore
    rgbColor("yellow")

    # Dichiarazione tempo corrente
    currentTime = f'{deviceState["utils"]["rtc"].datetime()[0]:04d}-{deviceState["utils"]["rtc"].datetime()[1]:02d}-{deviceState["utils"]["rtc"].datetime()[2]:02d}T{deviceState["utils"]["rtc"].datetime()[4]:02d}:{deviceState["utils"]["rtc"].datetime()[5]:02d}:{deviceState["utils"]["rtc"].datetime()[6]:02d}'
    
    try:
        # Misurazioni
        humE, temp = dhtMeasure()
        humI = (1 - measure(deviceState["sensors"]["sensorIn"], 50) / 4095) * 100
        lum = measure(deviceState["sensors"]["sensorLum"], 50) / 4095 * 100
    except Exception as e:
        raise TransientError(e)

    # Controllo misurazioni
    measurementsCheck(humI, humE, lum, temp)

    # Controllo misurazioni sicure
    secureMeasurementsCheck(temp, humE)

    # Controllo misurazioni con modalità
    measurementsMode(humI, humE, lum, temp)

    # Impostazione colore
    rgbColor("green")

# Funzione impostazione flag
def measureFlag(value: bool):
    # Impostazione valore
    deviceState["flags"]["measure"] = value

# ---

# Funzione connessione socket
def connSocket():
    try:
        print("\nWS connection...")
        
        # Creazione chiave casuale
        key_bytes = bytes([urandom.getrandbits(8) for _ in range(16)])
        key = ubinascii.b2a_base64(key_bytes).strip().decode()

        # Costruzione richiesta
        req = (
            f'GET /?token={deviceState["token"]}&authType=device&v=1 HTTP/1.1\r\n'
            f'Host: {deviceState["serverInfo"]["skIp"]}:{deviceState["serverInfo"]["skPort"]}\r\n'
            "Upgrade: websocket\r\n"
            "Connection: Upgrade\r\n"
            f"Sec-WebSocket-Key: {key}\r\n"
            "Sec-WebSocket-Version: 13\r\n"
            "\r\n"
        )
        
        # Configurazione socket
        s = sk.socket()
        addr = sk.getaddrinfo(deviceState["serverInfo"]["skIp"], deviceState["serverInfo"]["skPort"])[0][-1]

        s.connect(addr)
        s.send(req.encode())
        
        # Ricevi la risposta dal server
        resp = s.recv(1024)

        # Controllo codice 101
        if b"101" in resp:
            print("WS connection success\n")
            return s
        else:
            raise CriticalError("WS connection refused")

        return s
    except Exception as e:
        raise CriticalError(e)

# Funzione invio messaggi
def wsSend(sock, msg: str):
    try:
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
    except Exception as e:
        raise TransientError(e)

# Funzione ricezione messaggi
def wsRecv(sock, timeout=2):
    sock.settimeout(timeout)
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
            raise TransientError(e)
            return None

# Funzione gestione socket
def socketHandler():    
    # Dichiarazione tempo corrente
    currentTime = f'{deviceState["utils"]["rtc"].datetime()[0]:04d}-{deviceState["utils"]["rtc"].datetime()[1]:02d}-{deviceState["utils"]["rtc"].datetime()[2]:02d}T{deviceState["utils"]["rtc"].datetime()[4]:02d}:{deviceState["utils"]["rtc"].datetime()[5]:02d}:{deviceState["utils"]["rtc"].datetime()[6]:02d}'
    
    # Ricezione evento
    event = wsRecv(deviceState["sock"], 0.1)
    
    # Controllo evento
    if type(event) is dict and "event" in event:        
        # Gestore evento irrigazione
        if event["event"] == "v2/irrigation" and "interval" in event and deviceState["token"]:            
            irrigationEvent(currentTime, event)
        elif event["event"] == "v2/mode" and "mode" in event:
            settingsEvent(event)
    

    # Invio stato
    wsSend(deviceState["sock"], json.dumps({"event": "v2/status", "data":{"lastSeen":currentTime}}))

# ---

# Funzione irrigazione automatica
def irrigationAuto(date, humI1: float):
    # Calcolo tempo irrigazione
    irrigationTime = round(((deviceState["settings"]["humIMax"] - humI1) * deviceState["settings"]["kInterval"]))

    # Irrigazione
    irrigation(humI1, date, irrigationTime, "auto")

# Funzione irrigazione manuale
def irrigationConfig(date, irrigationTime: int):
    # Misurazione umidità
    humI1 = (1 - measure(deviceState["sensors"]["sensorIn"], 50) / 4095) * 100

    # Irrigazione
    irrigation(humI1, date, irrigationTime, "config")

# Funzione irrigazione
def irrigation(humI: float, date, irrigationTime: int, mode: str):
    # Controllo tempo irrigazione
    if irrigationTime > 0 and deviceState["flags"]["irrigate"] != True:
        print(f"Irrigation for {irrigationTime}s")

        # Impostazione colore
        rgbColor("cyan")

        # Accensione pompa
        pumpOn(humI, date, irrigationTime, mode)
        deviceState["utils"]["tim2"].init(mode=Timer.ONE_SHOT, period=irrigationTime * 1000, callback=lambda t: irrigateFlag(False))
    else:
        sendNotifications("ERRORE IRRIGAZIONE", "Non è stato possibile irrigare in quanto il tempo d'irrigazione era inferiore o uguale a 0 o il dispositivo stava già irrigando", "error")

# Funzione controllo irrigazione
def irrigationCheck(humI1: float, humI2: float, humE: float, lum: float, temp: float, date, irrigationTime: int, _type: str):
    # Impostazione colore
    rgbColor("yellow")

    # Controllo variazione umidità
    if humI2 <= humI1:
        # Invio notifica
        sendNotifications("ERRORE IRRIGAZIONE", f'Irrigazione di {irrigationTime}s del dispositivo {deviceState["info"]["name"]} non effettuata correttamente, controllare tanica d\'acqua!', "error")
    else:
        # Invio Irrigazione
        sendIrrigations(date, irrigationTime, _type, humI1, humI2, humE, lum, temp)

    # Impostazione colore
    rgbColor("green")

# Funzione spegnimento pompa
def pumpOff (humI1: float, date, irrigationTime: int, _type: str):
    deviceState["sensors"]["pump"].off()
    
    # Misurazioni
    humE, temp = dhtMeasure()
    humI2 = (1 - measure(deviceState["sensors"]["sensorIn"], 50) / 4095) * 100
    lum = measure(deviceState["sensors"]["sensorLum"], 50) / 4095 * 100

    # Controllo misurazioni
    measurementsCheck(humI2, humE, lum, temp)
    
    # Controllo irrigazione
    irrigationCheck(humI1, humI2, humE, lum, temp, date, irrigationTime, _type)

    # Impostazione informazioni
    deviceState["flags"]["irrigationInfo"] = None

# Funzione accensione pompa
def pumpOn(humI: float, date, irrigationTime: int, _type: str):
    # Impostazione informazioni
    deviceState["flags"]["irrigationInfo"] = humI, date, irrigationTime, _type

    # Impostazione flag
    deviceState["flags"]["irrigate"] = True

    # Accensione pompa
    deviceState["sensors"]["pump"].on()

# Funzione evento irrigazione
def irrigationEvent(date, event: dict):
    # Impostazione colore
    rgbColor("cyan")

    # Effettuazione irrigazione
    irrigationConfig(date, event["interval"])

# Funzione impostazione flag
def irrigateFlag(value: bool):
    # Impostazione valore
    deviceState["flags"]["irrigate"] = value


# ---

# Funzione scrittura misurazioni
def printMeasurement (humI: float, humE: float, temp: float, lum:float):
    print(f"Internal humidity: {round(humI)}%")
    print(f"External humidity: {humE}%")
    print(f"Temperature: {temp}°C")
    print(f"Luminosity: {round(lum)}%")

# ---

# Funzione deinizializzazione pin
def deinitPins():
    deviceState["utils"]["pwms"][0].deinit()
    deviceState["utils"]["pwms"][1].deinit()
    deviceState["utils"]["pwms"][2].deinit()

# Funzione spegnimento led
def rgbOff():
    deviceState["utils"]["pwms"][0].duty_u16(0)
    deviceState["utils"]["pwms"][1].duty_u16(0)
    deviceState["utils"]["pwms"][2].duty_u16(0)
    sleep(0.1)

# Funzione accensione colore
def rgbColor (color: str):
    # Dichiarazione valori rgb
    r, g, b = 0, 0, 0
    
    sleep(0.001)

    # Controllo colore
    if color == "red":
        r, g, b = 255, 0, 0
    elif color == "yellow":
        r, g, b = 230, 80, 0
    elif color == "green":
        r, g, b = 0, 255, 0
    elif color == "cyan":
        r, g, b = 0, 255, 255

    # Impostazione colore 
    deviceState["utils"]["pwms"][0].duty_u16(mapRange(r, 0, 255, 0, 65535))
    deviceState["utils"]["pwms"][1].duty_u16(mapRange(g, 0, 255, 0, 65535))
    deviceState["utils"]["pwms"][2].duty_u16(mapRange(b, 0, 255, 0, 65535))

# ---

# Funzione impostazioni
def settingsEvent(event):
    print(f'New mode: {event["mode"].upper()}')

    # Controllo modalità
    if event["mode"] == "auto" and "info" in event:
        
        print(f'New mode: {event["mode"].upper()}')
        print(f'New settings:\thumIMin --> {event["info"]["humIMin"]}\thumIMax --> {event["info"]["humIMax"]}\tkInterval --> {event["info"]["kInterval"]}')

        # Nuove impostazioni
        newSettings = {"humIMax": event["info"]["humIMax"], "humIMin": event["info"]["humIMin"], "kInterval": event["info"]["kInterval"], "mode": event["mode"]}
            
        # Conversione info
        parsedSettings = json.dumps(newSettings)
        
        # Sovrascrittura file
        with open("settings.json", "w") as settingsFile:
            settingsFile.write(parsedSettings)
            deviceState["settings"] = newSettings

    elif event["mode"] == "config" or event["mode"] == "safe":

        # Conversione info
        parsedSettings = json.dumps(deviceState["settings"])
        
        # Sovrascrittura file
        with open("settings.json", "w") as settingsFile:
            settingsFile.write(parsedSettings)
            deviceState["settings"]["mode"] = event["mode"]
        
    else:
        print("Invalid mode request\n")

# ---

# Funzione principale
def main():

    # Configurazione sensori
    sensorConfig()

    # Impostazione colore
    rgbColor("yellow")

    # Configurazione generale
    config()

    # Impostazione loop misurazioni
    deviceState["utils"]["tim1"].init(mode=Timer.PERIODIC, period=60000, callback=lambda t: measureFlag(True))

    # Impostazione colore
    rgbColor("green")

    # Loop
    while True:
        # Gestore connessione socket
        socketHandler()
        # Controllo flag misurazione
        if deviceState["flags"]["measure"] == True:
            # Impostazione flag
            measureFlag(False)

            # Misurazione
            measurements()

        # Controllo flag irrigazione
        if deviceState["flags"]["irrigate"] == False:
            # Controllo informazioni
            if deviceState["flags"]["irrigationInfo"] is not None:
            
                # Informazioni irrigazione
                humI, date, irrigationTime, _type = deviceState["flags"]["irrigationInfo"]

                # Controllo dati
                if humI is not None and date is not None and irrigationTime is not None and _type is not None:
                    # Spegnimento pompa
                    pumpOff(humI, date, irrigationTime, _type)

                    # Impostazione colore
                    rgbColor("green")

        sleep(1)

# Funzione gestiore errori critici
def criticError(e):
    # Stampa dettagli
    import sys
    import uio
    buf = uio.StringIO()
    sys.print_exception(e, buf)
    exc_str = buf.getvalue()

    print("Critical error:", e)
    print("\n", exc_str)

    # Pulizia hardware
    try:
        # Impostazione colore
        rgbColor("red")
    except Exception as hw_err:
        print("Hardware cleanup failed:", hw_err)

    # Invio notifica
    try:
        if "deviceState" in globals() and "token" in deviceState:
            sendNotifications("ERRORE DISPOSITIVO", str(e), "error")
    except Exception as notify_err:
        print("Failed to send notification:", notify_err)

    # Reset automatico
    print("Restarting device in 5 seconds...")
    sleep(5)
    reset()

# Esecuzione script
if __name__ == "__main__":
    while True:
        try:
            # Funzione pricipale
            main()

        except TransientError as e:
            print("Recoverable error:", e)

        except CriticalError as e:
            # Gestione errore
            criticError(e)

        except Exception as e:
            # Gestione errore
            criticError(e)