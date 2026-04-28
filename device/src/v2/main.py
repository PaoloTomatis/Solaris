# Importazione moduli
from machine import Pin, ADC, Timer, RTC, reset, PWM
from time import sleep, sleep_ms, ticks_ms, ticks_diff, mktime, localtime
from state import deviceState
import usocket as sk
import dht, network, ujson, ubinascii, urandom, urequests, struct, ntptime, utime, os, gc

# Impostazione flags
deviceState["flags"] = {"irrigate": False, "irrigationInfo": None, "readingDht": False, "lastStatusSend": 0, "lastWarningNotification": 0, "lastWifiAttempt": 0, "lastSockAttempt": 0, "lastAuthAttempt": 0, "unsavedData": False, "lastMeasurement": 0, "irrigationStartTime": None, "irrigationDuration": None, "irrigationMeasureTime": None}

# Headers base
BASE_HEADERS = {
    "Content-Type": "application/json",
    "user-agent": "esp32 - Solaris Vega"
}

# Classe errore critico
class CriticalError(Exception):
    pass

# Classe errore non bloccante
class TransientError(Exception):
    pass

# --- 

# Funzione gestione richieste get
def getHandler(url: str, name: str, token = None) :
    # Pulizia memoria
    gc.collect()

    print(gc.mem_free())

    # Controllo wifi
    if not deviceState["wifi"].isconnected():
        print(f"Get request error: {name} wifi not connected\n")
        return

    print(f"Get request: {name}...")

    # Dichiarazione headers
    headers = BASE_HEADERS.copy()

    # Controllo token
    if token:
        # Dichiarazione headers
        headers["Authorization"] = "Bearer " + token
    
    # Dichiarazione dati risposta
    resData = None

    # Inizializzazione risposta
    response = None
    
    # Gestione errori
    try:
        # Effettuazione richiesta
        response = urequests.get(url,
            headers=headers,
            timeout=10
        )
        
        # Richiesta dati
        raw = response.text

        # Chiusura richiesta
        response.close()

        # Pulizia richiesta
        del response

        # Pulizia memoria
        gc.collect()

        # Conversione dati
        resData = ujson.loads(raw)

        # Pulizia dati
        del raw
        
        print(f"Get request success: {name}\n")
        
        # Ritorno dati
        return resData["data"]
    except:
        raise

    finally:
        # Pulizia memoria
        gc.collect()

        # Chiusura richiesta
        try:
            response.close()
        except:
            pass

# Funzione gestione richieste post
def postHandler(url: str, payload: dict, name: str, token = None):
    # Pulizia memoria
    gc.collect()

    print(gc.mem_free())

    # Controllo wifi
    if not deviceState["wifi"].isconnected():
        print(f"Post request error: {name} wifi not connected\n")
        return None

    print(f"Post request: {name}...")

    # Dichiarazione headers
    headers = BASE_HEADERS.copy()

    # Controllo token
    if token:
        # Dichiarazione headers
        headers["Authorization"] = "Bearer " + token

    # Dichiarazione dati risposta
    resData = None

    # Inizializzazione risposta
    response = None
    
    # Gestione errori
    try:        
        # Effettuazione richiesta
        response = urequests.post(
            url,
            data=ujson.dumps(payload),
            headers=headers,
            timeout=10
        )

        # Richiesta dati
        raw = response.text

        # Chiusura richiesta
        response.close()

        # Pulizia richiesta
        del response

        # Pulizia memoria
        gc.collect()

        # Conversione dati
        resData = ujson.loads(raw)

        # Pulizia dati
        del raw

        print(f"Post request success: {name}\n")
        
        # Ritorno dati
        return resData["data"]
    except:
        raise

    finally:
        # Pulizia memoria
        gc.collect()

        # Chiusura richiesta
        try:
            response.close()
        except:
            pass

# Funzione invio avvisi
def sendNotifications (title: str, description: str, _type: str, loadingData=False):
    try:
        # Dichiarazione dati
        payload = {"title": title, "description": description, "type": _type}

        # Ritorno dati
        return postHandler(f'{deviceState["serverInfo"]["apiUrl"]}/notifications?authType=device', payload, "notifications", deviceState["token"])
    except Exception as e:
        # Controllo caricamento dati
        if not loadingData:
            # Caricamento notifiche
            notifications = readFile("notifications")

            # Controllo notifiche
            if len(notifications) > 5:
                notifications.pop(0)

            # Aggiornamento notifiche
            writeFile("notifications", [{"title":title, "description":description, "type":_type}] + notifications, True)
        else:
            raise CriticalError(e)

# Funzione invio irrigazione
def sendIrrigations (date, irrigationTime: int, _type: str, humIBefore: float, humIAfter: float, humE: float, lum: float, temp: float, loadingData=False):
    try:
        # Dichiarazione dati
        payload = {"irrigatedAt": date, "interval": irrigationTime, "type": _type, "humIBefore": humIBefore, "humIAfter": humIAfter, "humE": humE, "lum": lum, "temp": temp}

        # Ritorno dati
        return postHandler(f'{deviceState["serverInfo"]["apiUrl"]}/irrigations?authType=device', payload, "irrigation", deviceState["token"])
    except Exception as e:
        # Controllo caricamento dati
        if not loadingData:
            # Caricamento irrigazioni
            irrigations = readFile("irrigations")

            # Controllo irrigazioni
            if len(irrigations) > 5:
                irrigations.pop(0)

            # Aggiornamento irrigazioni
            writeFile("irrigations", [{"humI1":humIBefore, "humI2":humIAfter, "humE":humE, "temp":temp, "lum":lum, "irrigationTime":irrigationTime, "date":date, "type":_type}] + irrigations, True)
        else:
            raise CriticalError(e)

# Funzione invio misurazioni
def sendMeasurements (humI: float, humE: float, temp: float, lum: float, date, loadingData=False):
    try:
        # Dichiarazione dati
        payload = {"measuredAt": date, "humI": humI, "humE": humE, "temp":temp, "lum":lum}

        # Ritorno dati
        return postHandler(f'{deviceState["serverInfo"]["apiUrl"]}/measurements?authType=device', payload, "measurements", deviceState["token"])
    except Exception as e:
        # Controllo caricamento dati
        if not loadingData:
            # Caricamento irrigazioni
            measurements = readFile("measurements")

            # Controllo irrigazioni
            if len(measurements) > 5:
                measurements.pop(0)

            # Aggiornamento irrigazioni
            writeFile("measurements", [{"humI":humI, "humE":humE, "temp":temp, "lum":lum, "currentTime":date}] + measurements, True)
        else:
            raise CriticalError(e)

# Funzione login
def login():
    try:
        # Dichiarazione dati
        payload = {"key": deviceState["info"]["key"], "psw": deviceState["info"]["psw"]}
        
        # Ritorno dati
        return postHandler(f'{deviceState["serverInfo"]["authUrl"]}/device-login?authType=device', payload, "login")
    except Exception as e:
        return

# Funzione richiesta impostazioni
def getSettings():
    try:
        # Ritorno dati
        return getHandler(f'{deviceState["serverInfo"]["apiUrl"]}/me/device-settings?authType=device', "settings", deviceState["token"])
    except Exception as e:
        return None

# ---

# Funzione mappatura
def mapRange(x, in_min, in_max, out_min, out_max):
    # Controllo valori
    if in_max == in_min:
        raise TransientError("Range map error: cannot divide by 0")

    return int((x - in_min) * (out_max - out_min) / (in_max - in_min) + out_min)

# ---

# Funzione lettura file
def readFile(path: str):
    # Dichiarazione dati file
    fileData = None

    # Caricamento dati
    with open(f'{path}.json', 'r') as file:
        fileData = ujson.load(file)

    # Ritorno dati
    return fileData

# Funzione scrittura file
def writeFile(path: str, data, unsaved = False):
    # Aggiornamento misurazioni
    with open(f'{path}.tmp', 'w') as file:
        file.write(ujson.dumps(data))

    # Rinominazione file
    os.rename(f'{path}.tmp', f'{path}.json')

    # Controllo salvataggio
    if unsaved:
        # Impostazione flag
        updateFlag("unsavedData", True)

# Funzione caricamento dati
def loadData():
    try:
        wifiInfo = {}
        serverInfo = {}
        settings = {}
        deviceInfo = {}
        
        # Caricamento informazione wifi
        wifiInfo = readFile("wifiInfo")
            
        # Caricamento informazioni connessioni
        serverInfo = readFile("serverInfo")
            
        # Caricamento impostazioni
        settings = readFile("settings")
            
        # Caricamento informazioni
        deviceInfo = readFile("deviceInfo")
            
        # Ritorno dati
        return [wifiInfo, serverInfo, settings, deviceInfo]
    except Exception as e:
        raise CriticalError(e)

# Funzione caricamento dati salvati
def loadSavedData():
    try:        
        # Caricamento informazioni irrigazioni
        irrigations = readFile("irrigations")
        
        # Iterazione irrigazioni
        for irrigation in irrigations:
            # Invio Irrigazione
            sendIrrigations(irrigation["date"], irrigation["irrigationTime"], irrigation["type"], irrigation["humI1"], irrigation["humI2"], irrigation["humE"], irrigation["lum"], irrigation["temp"], True)

        # Pulizia irrigazioni
        del irrigations

        # Aggiornamento irrigazioni
        writeFile("irrigations", [])

        # Caricamento informazione misurazioni
        measurements = readFile("measurements")

        # Iterazione misurazioni
        for measurement in measurements:
            # Invio misurazioni
            sendMeasurements(measurement["humI"], measurement["humE"], measurement["temp"], measurement["lum"], measurement["currentTime"], True)

        # Pulizia misurazioni
        del measurements

        # Aggiornamento misurazioni
        writeFile("measurements", [])

        # Caricamento informazione notifiche
        notifications = readFile("notifications")

        # Iterazione notifiche
        for notification in notifications:
            # Invio notifiche
            sendNotifications(notification["title"], notification["description"], notification["type"], True)

        # Pulizia notifiche
        del notifications

        # Aggiornamento notifiche
        writeFile("notifications", [])

    except Exception as e:
        raise CriticalError(e)

# Funzione sincronizzazione orario
def syncTime():
    for attempt in range(5):
        try:
            print("\nTime sync...")

            # Aggiornamento orario
            ntptime.settime()
            epoch_local = utime.time()
            lt = utime.localtime(epoch_local)
            deviceState["rtc"].datetime((lt[0], lt[1], lt[2], lt[6], lt[3], lt[4], lt[5], 0))
            print("Time sync success\n")
            return
        except OSError as e:
            print(f"Time sync attempt {attempt+1} failed: {e}")
            sleep(1)
    raise TransientError("Sync time error: failed after retries")

# Funzione connessione wifi
def connWifi(tentatives=10):
    try:
        if deviceState["wifi"]:
            # Definizione wlan
            wlan = deviceState["wifi"]
            
            # Controllo connessione
            if wlan.isconnected():
                print("Wifi connection success")
                return True

            # Disconnessione
            wlan.disconnect()
            sleep(1)
        else:
            # Configurazione wifi
            wlan = network.WLAN(network.STA_IF)
            wlan.active(True)

            # Impostazione wifi
            deviceState["wifi"] = wlan

        # Connessione wifi
        wlan.connect(deviceState["wifiInfo"]["ssid"], deviceState["wifiInfo"]["psw"])
        print("\nWifi connection...")

        # Tentativi connessione
        for i in range(tentatives):
            # Controllo connessione
            if wlan.isconnected():
                print("Wifi connection success")
                return True

            sleep(1)
            print(f"Wifi tentative {i+1}")
        
        print("Wifi connection failed")
    except Exception as e:
        raise CriticalError(e)

# Funzione autenticazione
def authenticationConfig():
    # Effettuazione login
    loginData = login()

    # Definizione token
    deviceState["token"] = None

    # Controllo dati
    if loginData:
        # Impostazione token e nuove info dispositivo
        deviceState["token"] = loginData["accessToken"]
        newDevice = loginData["device"]

        # Controllo nuove info dispositivo
        if newDevice:
            # Conversione dispositivo
            parsedInfo = {"id":newDevice["id"], "key":deviceState["info"]["key"], "psw":deviceState["info"]["psw"], "name": newDevice["name"], "prototypeModel":newDevice["prototypeModel"]}
            
            # Sovrascrittura file
            writeFile("deviceInfo", parsedInfo)
            deviceState["info"] = parsedInfo

        # Richiesta impostazioni
        newSettings = getSettings()
        
        # Controllo impostazioni
        if newSettings:
            # Sovrascrittura file
            writeFile("settings", newSettings)
            deviceState["settings"] = newSettings
        
        
        # Connessione socket
        connSocket()

        # Controllo socket
        if not deviceState["sock"] and deviceState["wifi"].isconnected():
            # Ritorno errore
            raise Exception("Socket connection error: connection failed")

# ---

# Funzione misurazione dht
def dhtMeasure():
    MIN_INTERVAL = 2500  # ms

    now = ticks_ms()
    last = deviceState["dhtRead"]

    # rate limiter duro
    if ticks_diff(now, last) < MIN_INTERVAL:
        return None, None

    for _ in range(3):
        try:
            updateFlag("readingDht", True)
            sleep_ms(50)

            deviceState["sensors"]["sensorOut"].measure()

            h = deviceState["sensors"]["sensorOut"].humidity()
            t = deviceState["sensors"]["sensorOut"].temperature()

            deviceState["dhtRead"] = ticks_ms()
            updateFlag("readingDht", False)

            return h, t

        except OSError:
            updateFlag("readingDht", False)
            sleep_ms(2500)

    return None, None

# Funzione misurazione sensorIn
def sensorInMeasure():
    # Misurazione normale
    raw = (1 - measure(deviceState["sensors"]["sensorIn"], 50) / 4095) * 100

    # Controllo calibrazione
    if "sensorHumIMin" in deviceState["settings"] and "sensorHumIMax" in deviceState["settings"]:
        dry = deviceState["settings"]["sensorHumIMin"]
        wet = deviceState["settings"]["sensorHumIMax"]
        parsed = (dry - raw) / (dry - wet) * 100
        return min(100, max(parsed, 0))
    else:
        return raw

# Funzione misurazione sensorLum
def sensorLumMeasure():
    # Misurazione normale
    raw = measure(deviceState["sensors"]["sensorLum"], 50) / 4095 * 100

    # Controllo calibrazione
    if "sensorLumMin" in deviceState["settings"] and "sensorLumMax" in deviceState["settings"]:
        dry = deviceState["settings"]["sensorLumMin"]
        wet = deviceState["settings"]["sensorLumMax"]
        parsed = (dry - raw) / (dry - wet) * 100
        return min(100, max(parsed, 0))
    else:
        return raw

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
        raise CriticalError("Measurement check error: soil humidity measurement invalid")

    # Controllo humE
    if humE is None or humE < 0 or humE > 100:
        # Ritorno errore
        raise CriticalError("Measurement check error: external humidity measurement invalid")

    # Controllo temp
    if temp is None:
        # Ritorno errore
        raise CriticalError("Measurement check error: temperature measurement invalid")

    # Controllo temp
    if lum is None or lum < 0 or lum > 100:
        # Ritorno errore
        raise CriticalError("Measurement check error: luminosity measurement invalid")

# Funzione controllo misurazioni sicure
def secureMeasurementsCheck(temp: float, humE: float):
    # Controllo ultima notifica
    if deviceState["flags"]["lastWarningNotification"] and mktime(localtime()) - mktime(deviceState["flags"]["lastWarningNotification"]) < 3600:
        return

    # Controllo temperatura
    if temp <= 2:
        # Invio avviso
        sendNotifications("TEMPERATURA BASSA", "La temperatura della tua serra è inferiore ai 2 gradi, questo potrebbe danneggiare le tue coltivazioni!", "warning")
        # Impostazione ultima notifica
        updateFlag("lastWarningNotification", localtime())
    elif temp >= 30:
        # Invio avviso
        sendNotifications("TEMPERATURA ALTA", "La temperatura della tua serra è superiore ai 30 gradi, questo potrebbe danneggiare le tue coltivazioni!", "warning")
        # Impostazione ultima notifica
        updateFlag("lastWarningNotification", localtime())

    # Controllo umidità esterna
    if humE <= 30:
        # Invio avviso
        sendNotifications("UMIDITA' BASSA", "L'umidità esterna della tua serra è inferiore al 30%, questo potrebbe danneggiare le tue coltivazioni!", "warning")
        # Impostazione ultima notifica
        updateFlag("lastWarningNotification", localtime())
    elif humE >= 85:
        # Invio avviso
        sendNotifications("UMIDITA' ALTA", "L'umidità esterna della tua serra è superiore al 85%, questo potrebbe danneggiare le tue coltivazioni!", "warning")
        # Impostazione ultima notifica
        updateFlag("lastWarningNotification", localtime())

# Funzione misurazione con controllo modalità
def measurementsMode(humI: float, humE: float, lum: float, temp: float):
    # Dichiarazione tempo corrente
    currentTime = f'{deviceState["rtc"].datetime()[0]:04d}-{deviceState["rtc"].datetime()[1]:02d}-{deviceState["rtc"].datetime()[2]:02d}T{deviceState["rtc"].datetime()[4]:02d}:{deviceState["rtc"].datetime()[5]:02d}:{deviceState["rtc"].datetime()[6]:02d}'

    # Stampo misurazioni
    printMeasurement(humI, humE, temp, lum)

    # Controllo connessione wifi
    if not deviceState["wifi"].isconnected() or not deviceState["token"]:
        # Caricamento misurazioni
        measurements = readFile("measurements")

        # Controllo misurazioni
        if len(measurements) > 5:
            measurements.pop(0)

        # Aggiornamento misurazioni
        writeFile("measurements",[{"humI":humI, "humE":humE, "temp":temp, "lum":lum, "currentTime":currentTime}] + measurements, True)

    # Controllo modalità config
    elif deviceState["settings"]["mode"] == "config":
        # Invio misurazioni
        sendMeasurements(humI, humE, temp, lum, currentTime)
    # Controllo modalità auto
    elif deviceState["settings"]["mode"] == "auto":
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

    # Modifica flag
    updateFlag("lastMeasurement", ticks_ms())

    # Dichiarazione tempo corrente
    currentTime = f'{deviceState["rtc"].datetime()[0]:04d}-{deviceState["rtc"].datetime()[1]:02d}-{deviceState["rtc"].datetime()[2]:02d}T{deviceState["rtc"].datetime()[4]:02d}:{deviceState["rtc"].datetime()[5]:02d}:{deviceState["rtc"].datetime()[6]:02d}'
    
    try:
        # Misurazioni
        humE, temp = dhtMeasure()
        humI = sensorInMeasure()
        lum = sensorLumMeasure()
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

# ---

# Funzione connessione socket
def connSocket():
    # Controllo wifi
    if not deviceState["wifi"].isconnected():
        print(f"WS connection error: wifi not connected\n")
        # Impostazione connessione socket
        deviceState["sock"] = None

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
        else:
            raise CriticalError("Connect socket error: connection refused")

        # Impostazione connessione socket
        deviceState["sock"] = s
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
            return ujson.loads(text)
        except:
            return payload

    except Exception as e:
        # Nessun messaggio o errore di timeout
        if "ETIMEDOUT" in str(e) or "timeout" in str(e):
            return None
        elif "ENOTCONN" in str(e) or "ECONNRESET" in str(e):
            deviceState["sock"] = None
            return None
        else:
            raise TransientError(e)
            return None

# Funzione gestione socket
def socketHandler():    
    # Dichiarazione tempo corrente
    currentTime = f'{deviceState["rtc"].datetime()[0]:04d}-{deviceState["rtc"].datetime()[1]:02d}-{deviceState["rtc"].datetime()[2]:02d}T{deviceState["rtc"].datetime()[4]:02d}:{deviceState["rtc"].datetime()[5]:02d}:{deviceState["rtc"].datetime()[6]:02d}'
    
    # Ricezione evento
    event = wsRecv(deviceState["sock"], 0.1)
    
    # Controllo evento
    if type(event) is dict and "event" in event:        
        # Gestore evento irrigazione
        if event["event"] == "v2/irrigation" and "interval" in event and deviceState["token"]:            
            irrigationEvent(currentTime, event)
        elif event["event"] == "v2/mode" and "mode" in event:
            settingsEvent(event)
        elif event["event"] == "v2/calibration" and "sensor" in event:
            calibrationEvent(event)
    
    # Controllo ultimo invio
    if ticks_diff(ticks_ms(), deviceState["flags"]["lastStatusSend"]) > 5000:
        # Invio stato
        wsSend(deviceState["sock"], ujson.dumps({"event": "v2/status", "data":{"lastSeen":currentTime}}))
        # Impostazione flag
        updateFlag("lastStatusSend", ticks_ms())

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
    humI1 = sensorInMeasure()

    # Irrigazione
    irrigation(humI1, date, irrigationTime, "config")

# Funzione irrigazione
def irrigation(humI: float, date, irrigationTime: int, mode: str):
    # Impostazione durata irrigazione
    irrigationTime = min(irrigationTime, 120)

    # Controllo tempo irrigazione
    if irrigationTime > 0 and deviceState["flags"]["irrigate"] != True:
        print(f"Irrigation for {irrigationTime}s")

        # Impostazione colore
        rgbColor("cyan")

        # Accensione pompa
        pumpOn(humI, date, irrigationTime, mode)

        # Impostazione timer irrigazione
        updateFlag("irrigationStartTime", ticks_ms())
        updateFlag("irrigationDuration", irrigationTime * 1000)

        # Impostazione timer fallback
        deviceState["tim1"].init(period = irrigationTime*1000 + 2000, mode = Timer.ONE_SHOT, callback = lambda t: deviceState["sensors"]["pump"].off())
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
    elif not deviceState["wifi"].isconnected() or not deviceState["token"]:
        # Caricamento irrigazioni
        irrigations = readFile("irrigations")

        # Controllo irrigazioni
        if len(irrigations) > 5:
            irrigations.pop(0)

        # Aggiornamento irrigazioni
        writeFile("irrigations", [{"humI1":humI1, "humI2":humI2, "humE":humE, "temp":temp, "lum":lum, "irrigationTime":irrigationTime, "date":date, "type":_type}] + irrigations, True)
    else:
        # Invio Irrigazione
        sendIrrigations(date, irrigationTime, _type, humI1, humI2, humE, lum, temp)

    # Impostazione colore
    rgbColor("green")

# Funzione spegnimento pompa
def pumpOff ():
    deviceState["sensors"]["pump"].off()

    # Impostazione flag
    updateFlag("irrigationStartTime", None)
    updateFlag("irrigationDuration", None)

    # Impostazione timer misurazione irrigazione
    updateFlag("irrigationMeasureTime", ticks_ms() + 30000)

# Funzione misurazione irrigazione
def irrigationMeasurements():
    # Controllo informazioni
    if deviceState["flags"]["irrigationInfo"] is not None:
        # Informazioni irrigazione
        humI, date, irrigationTime, _type = deviceState["flags"]["irrigationInfo"]

        # Controllo dati
        if humI is not None and date is not None and irrigationTime is not None and _type is not None:
            # Impostazione colore
            rgbColor("cyan")
            
            # Misurazioni
            humE, temp = dhtMeasure()
            humI2 = sensorInMeasure()
            lum = sensorLumMeasure()

            # Controllo misurazioni
            measurementsCheck(humI2, humE, lum, temp)

            # Controllo irrigazione
            irrigationCheck(humI, humI2, humE, lum, temp, date, irrigationTime, _type)

            # Impostazione informazioni
            updateFlag("irrigationInfo", None)

            # Impostazione colore
            rgbColor("green")
        else:
            raise CriticalError("Irrigation measurements error: irrigation failed")
    else:
        raise CriticalError("Irrigation measurements error: irrigation failed")

# Funzione accensione pompa
def pumpOn(humI: float, date, irrigationTime: int, _type: str):
    # Impostazione informazioni
    updateFlag("irrigationInfo", (humI, date, irrigationTime, _type))

    # Impostazione flag
    updateFlag("irrigate", True)

    # Accensione pompa
    deviceState["sensors"]["pump"].on()

# Funzione evento irrigazione
def irrigationEvent(date, event: dict):
    # Impostazione colore
    rgbColor("cyan")

    # Effettuazione irrigazione
    irrigationConfig(date, event["interval"])

# Funzione impostazione flag
def updateFlag(flag: str, value: bool):
    # Impostazione valore
    deviceState["flags"][flag] = value

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
    deviceState["pwms"][0].deinit()
    deviceState["pwms"][1].deinit()
    deviceState["pwms"][2].deinit()

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
    deviceState["pwms"][0].duty_u16(mapRange(r, 0, 255, 0, 65535))
    deviceState["pwms"][1].duty_u16(mapRange(g, 0, 255, 0, 65535))
    deviceState["pwms"][2].duty_u16(mapRange(b, 0, 255, 0, 65535))

# ---

# Funzione impostazioni
def settingsEvent(event):
    print(f'New mode: {event["mode"].upper()}')

    # Controllo modalità
    if "info" in event:
        # Controllo differenza firmwareId
        if event["info"]["firmwareId"] != deviceState["settings"]["firmwareId"]:
            # Reset
            reset()

        elif event["mode"] == "auto" or event["mode"] == "config":
            # Aggiornamento impostazioni
            deviceState["settings"] = event["info"]
            deviceState["settings"]["mode"] = event["mode"]
            writeFile("settings", deviceState["settings"])

    elif event["mode"] == "config" or event["mode"] == "safe":
        # Aggiornamento impostazioni
        deviceState["settings"]["mode"] = event["mode"]
        writeFile("settings", deviceState["settings"])
        
    else:
        print("Invalid mode request\n")

# Funzione impostazioni
def calibrationEvent(event):
    print(f'Calibration: {event["sensor"]}')

    # Gestione errori
    try:
        # Controllo sensore
        if event["sensor"] == "sensorHumIMin" or event["sensor"] == "sensorHumIMax":
            # Misurazione
            measurement = (1 - measure(deviceState["sensors"]["sensorIn"], 50) / 4095) * 100

            print(f"{measurement}%")

            # Dichiarazione payload
            payload = {"sensor":event["sensor"], "measurement":measurement}

            # Invio calibrazione
            newSettings = postHandler(f'{deviceState["serverInfo"]["apiUrl"]}/devices-settings/calibration/data?authType=device', payload, "calibration", deviceState["token"])

            # Aggiornamento impostazioni
            deviceState["settings"] = newSettings
            writeFile("settings", deviceState["settings"])

        elif event["sensor"] == "sensorLumMin" or event["sensor"] == "sensorLumMax":
            # Misurazione
            measurement = measure(deviceState["sensors"]["sensorLum"], 50) / 4095 * 100

            print(f"{measurement}%")

            # Dichiarazione payload
            payload = {"sensor":event["sensor"], "measurement":measurement}

            # Invio calibrazione
            newSettings = postHandler(f'{deviceState["serverInfo"]["apiUrl"]}/devices-settings/calibration/data?authType=device', payload, "calibration", deviceState["token"])

            # Aggiornamento impostazioni
            deviceState["settings"] = newSettings
            writeFile("settings", deviceState["settings"])

        else:
            print("Invalid sensor request\n")

    except Exception as e:
        raise CriticalError(e)

# ---

# Funzione principale
def mainLoop():
    # Loop
    while True:        
        # Controllo flag lettura dht
        if deviceState["flags"]["readingDht"]:
            sleep(1)
            continue

        # Controllo flag irrigazione
        if deviceState["flags"]["irrigationStartTime"] is not None and deviceState["flags"]["irrigationDuration"] is not None:
            # Controllo tempo passato
            if ticks_diff(ticks_ms(), deviceState["flags"]["irrigationStartTime"]) >= deviceState["flags"]["irrigationDuration"] and deviceState["flags"]["irrigate"] == True:
                # Aggiornamento flag
                updateFlag("irrigate", False)

                # Spegnimento pompa
                pumpOff()

        # Controllo wifi
        if not deviceState["wifi"].isconnected():
            # Chiusura connessione
            try:
                deviceState["sock"].close()
            except:
                pass

            deviceState["sock"] = None

            # Controllo tempo passato
            if ticks_diff(ticks_ms(), deviceState["flags"]["lastWifiAttempt"]) > 60000:
                # Impostazione colore
                rgbColor("yellow")
                # Connessione wifi
                connWifi(3)
                # Impostazione flag
                updateFlag("lastWifiAttempt", ticks_ms())

                # Impostazione colore
                rgbColor("green")
        elif not deviceState["token"]:
            # Controllo tempo passato
            if ticks_diff(ticks_ms(), deviceState["flags"]["lastAuthAttempt"]) > 60000:
                # Impostazione colore
                rgbColor("yellow")
                # Autenticatione
                authenticationConfig()
                # Impostazione flag
                updateFlag("lastAuthAttempt", ticks_ms())

                # Impostazione colore
                rgbColor("green")
        elif not deviceState["sock"]:
            # Controllo tempo passato
            if ticks_diff(ticks_ms(), deviceState["flags"]["lastSockAttempt"]) > 60000:
                # Impostazione colore
                rgbColor("yellow")
                # Connessione socket
                connSocket()
                # Impostazione flag
                updateFlag("lastSockAttempt", ticks_ms())
                # Impostazione colore
                rgbColor("green")

        # Controllo connessione socket
        if deviceState["sock"]:
            # Gestore connessione socket
            socketHandler()
            
        # Controllo misurazione
        if ticks_diff(ticks_ms(), deviceState["flags"]["lastMeasurement"]) > 600000:
            # Misurazione
            measurements()

        # Controllo flag misurazione irrigazione
        if deviceState["flags"]["irrigationMeasureTime"] is not None:
            # Controllo tempo passato
            if ticks_diff(ticks_ms(), deviceState["flags"]["irrigationMeasureTime"]) >= 0:
                # Impostazione flag
                updateFlag("irrigationMeasureTime", None)

                # Misurazione irrigazione
                irrigationMeasurements()

        # Controllo salvataggi
        if deviceState["flags"]["unsavedData"] == True and deviceState["token"] and deviceState["wifi"].isconnected():
            # Caricamento dati
            loadSavedData()

            # Impostazione flag
            updateFlag("unsavedData", False)

        sleep(1)

# Funzione main
def main():
    # Pulizia memoria
    gc.collect()
    
    print("\n\n\n-- MAIN v0.0.2 STABLE (Solaris Vega) --")

    while True:
        try:
            # Funzione pricipale
            mainLoop()

        except TransientError as e:
            print("RECOVERABLE ERROR\t|\t", e)

        except CriticalError as e:
            # Gestione errore
            criticError(e)

        except Exception as e:
            # Gestione errore
            criticError(e)

# Funzione gestiore errori critici
def criticError(e):
    # Stampa dettagli
    import sys

    try:
        import uio
        buf = uio.StringIO()
        sys.print_exception(e, buf)
        exc_str = buf.getvalue()
    except:
        exc_str = str(e)

    print("CRITICAL ERROR\t|\t", exc_str)


    # Pulizia hardware
    try:
        # Impostazione colore
        rgbColor("red")
    except Exception as hw_err:
        print("Hardware cleanup failed:", hw_err)
        
    # Deinizializzazione led
    try:
        deinitPins()
    except:
        pass

    # Invio notifica
    try:
        if "deviceState" in globals() and "token" in deviceState:
            sendNotifications("ERRORE DISPOSITIVO", exc_str[-300:], "error")
    except Exception as notify_err:
        print("Failed to send notification:", notify_err)

    # Reset automatico
    print("Restarting device in 5 seconds...")
    sleep(5)
    reset()

# Esecuzione script
if __name__ == "__main__":
    main()
