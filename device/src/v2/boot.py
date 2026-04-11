# Importazione moduli
from machine import Pin, RTC, reset, PWM
from time import sleep, ticks_ms, ticks_diff
import network, json, urequests, ntptime, utime, gc, os

# Dichiarazione stato dispositivo
deviceState = {}

# Impostazione flags
deviceState["flags"] = {"lastWifiAttempt": 0, "lastAuthAttempt": 0, "wifiAttemps":0, "authAttemps":0}

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

# Funzione gestione richieste get in streaming
def getStreamHandler(url: str, name: str, token = None):
    # Pulizia memoria
    gc.collect()

    # Controllo wifi
    if not deviceState["utils"]["wifi"].isconnected():
        print(f"Stream request error: {name} wifi not connected\n")
        return None

    print(f"Stream request: {name}...")

    # Controllo token
    if token:
        # Dichiarazione headers
        headers = {"Authorization": f"Bearer {token}", "user-agent": "esp32 - Solaris Vega"}
    else:
        # Dichiarazione headers
        headers = {"user-agent": "esp32 - Solaris Vega"}
    
    # Gestione errori
    try:
        # Effettuazione richiesta con stream attivo
        response = urequests.get(url, headers=headers, stream=True)
        
        # Controllo codice stato
        if response.status_code != 200:
            response.close()
            raise Exception(f"Status code {response.status_code}")

        print(f"Stream request started: {name}\n")
        
        # Ritorno l'oggetto response per la lettura sequenziale
        return response
        
    except Exception as e:
        print(f"Stream request error: {name}", e, "\n")
        return None

# Funzione gestione richieste get
def getHandler(url: str, name: str, token = None) :
    # Pulizia memoria
    gc.collect()

    # Controllo wifi
    if not deviceState["utils"]["wifi"].isconnected():
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
            headers=headers
        )
        
        try:
            # Richiesta dati
            resData = response.json()
        except:
            if "message" in resData:
                raise Exception(resData["message"])
            else:
                raise Exception("Unknown error")
        
        print(f"Get request success: {name}\n")
        
        # Ritorno dati
        return resData["data"]
    except Exception as e:
        print(f"Get request error: {name}",e, "\n")
        return None
    finally:
        # Controllo risposta
        if response:
            # Chiusura richiesta
            response.close()

        # Eliminazione richiesta
        del response

        # Eliminazione dati
        del resData

# Funzione gestione richieste post
def postHandler(url: str, payload: dict, name: str, token = None):
    # Pulizia memoria
    gc.collect()

    # Controllo wifi
    if not deviceState["utils"]["wifi"].isconnected():
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
            data=json.dumps(payload),
            headers=headers
        )
        
        try:
            # Richiesta dati
            resData = response.json()
        except:
            if "message" in resData:
                raise Exception(resData["message"])
            else:
                raise Exception("Unknown error")
        
        print(f"Post request success: {name}\n")
        
        # Ritorno dati
        return resData["data"]
    except Exception as e:            
        print(f"Post request error: {name}", e, "\n")
        return None
    finally:
        # Controllo risposta
        if response:
            # Chiusura richiesta
            response.close()

        # Eliminazione richiesta
        del response

        # Eliminazione dati
        del resData

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
            if len(notifications) > 10:
                notifications.pop(0)

            # Aggiornamento notifiche
            writeFile("notifications", [{"title":title, "description":description, "type":_type}] + notifications, True)
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

# Funzione lettura file
def readFile(path: str):
    # Dichiarazione dati file
    fileData = None

    # Caricamento dati
    with open(f'{path}.json', 'r') as file:
        fileData = json.load(file)

    # Ritorno dati
    return fileData

# Funzione scrittura file
def writeFile(path: str, data):
    # Aggiornamento misurazioni
    with open(f'{path}.tmp', 'w') as file:
        file.write(json.dumps(data))

    # Rinominazione file
    os.rename(f'{path}.tmp', f'{path}.json')

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

# Funzione connessione wifi
def connWifi(tentatives=10):
    try:
        if deviceState["utils"]["wifi"]:
            # Definizione wlan
            wlan = deviceState["utils"]["wifi"]
            
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
            deviceState["utils"]["wifi"] = wlan

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

# Funzione controllo esistenza file
def exists(path):
    try:
        os.stat(path)
        return True
    except OSError:
        return False

# Funzione richiesta versione installata
def getCurrentVersion():
    if not exists("main.py"):
        return None
        
    try:
        import main
        return main.getCurrentVersion()
    except Exception as e:
        print(f"error reading current version: {e}")
        return None

# Funzione confronto versioni
def getLatestVersion():
    try:
        # Richiesta versione
        firmwareVersion = getHandler(f'{deviceState["serverInfo"]["apiUrl"]}/devices-versions/latest?authType=device', "devices versions latest", deviceState["token"])

        # Ritorno versione
        return firmwareVersion
    except Exception as e:
        raise CriticalError(e)

# Funzione installazione versione firmware
def installVersion(versionId: str):
    try:
        # Pulizia della ram
        gc.collect()

        # Richiesta in streaming
        response = getStreamHandler(f'{deviceState["serverInfo"]["apiUrl"]}/devices-versions/{versionId}?authType=device', "install firmware", deviceState["token"])

        # Controllo risposta
        if response:
            # Apertura file temporaneo per scrittura
            with open("main.tmp", "wb") as f:

                while True:
                # Lettura chunk
                    chunk = response.raw.read(512)

                    # Controllo chunk
                    if not chunk:
                        break

                    # Scrittura chunk
                    f.write(chunk)

            # Chiusura stream
            response.close()

            # Controllo integrità file
            if os.stat("main.tmp")[6] > 0:
                # Rimozione vecchio file
                try: os.remove("main.py")
                except: pass

                # Rinominazione file
                os.rename("main.tmp", "main.py")
                
                # Pulizia della ram
                gc.collect()

                print("device version installation finished")
                
                # Reset
                reset()
            else:
                raise Exception("downloaded file is empty")

    except Exception as e:
        # Pulizia file temporaneo in caso di errore
        try: os.remove("main.tmp")
        except: pass
        
        # Rilancio errore critico
        raise CriticalError(e)

# Funzione confronto versioni
def checkVersions(v1: str, v2: str):
    try:
        # Richiesta versione
        firmwareVersion = getHandler(f'{deviceState["serverInfo"]["apiUrl"]}/devices-versions/check?authType=device&firmwareId1={v1}&firmwareVersion2={v2}', "devices versions check", deviceState["token"])

        # Ritorno versione
        return firmwareVersion
    except Exception as e:
        raise CriticalError(e)

# ---

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

# Funzione configurazione sensori
def sensorConfig():
    # Dichiarazione pin led
    pwmPins = [27,13,12]
    pwms = [PWM(Pin(pwmPins[0])),PWM(Pin(pwmPins[1])), PWM(Pin(pwmPins[2]))]
    [pwm.freq(1010) for pwm in pwms]

    # Creazione orario
    rtc = RTC()

    # Impostazione dati
    deviceState["utils"] = {"rtc":rtc, "pwms":pwms, "wifi":None}

# Funzione configurazione versione
def versionConfig():
    # Ricavo versione dispositivo
    firmwareId = getCurrentVersion()

    # Controllo versione dispositivo
    if firmwareId:
        if firmwareId != deviceState["settings"]["firmwareId"]:
            # Installazione versione
            installVersion(deviceState["settings"]["firmwareId"])
    else:
        # Richiesta ultima versione
        firmwareVersion = getLatestVersion()

        # Installazione versione
        installVersion(firmwareVersion["id"])

# Funzione configurazione
def config():
    # Configurazione sensori
    sensorConfig()

    # Impostazione colore
    rgbColor("magenta")

    # Caricamento dati
    [deviceState["wifiInfo"], deviceState["serverInfo"], deviceState["settings"], deviceState["info"]] = loadData()

    # Connessione wifi
    connWifi()

    try:
        # Sincronizzazione orario
        syncTime()
    except Exception:
        print("Time sync failed")

    # Autenticazione
    authenticationConfig()

# Funzione pulizia profonda
def deepClean():
    print("RAM cleanup")

    print(f"Free memory before: {gc.mem_free()} bytes")
    
    try:
        # Deinizializzazione led
        deinitPins()
    except:
        pass
    
    # Lista moduli da mantenere
    keep = ('gc', 'os', 'machine', 'deepClean', "sleep")

    # Pulizia moduli
    for name in list(globals().keys()):
        if name not in keep and not name.startswith('__'):
            del globals()[name]
    
    # Pulizia memoria ripetutua
    for _ in range(3):
        gc.collect()
    
    print(f"Free memory after: {gc.mem_free()} bytes")

    sleep(5)

# ---

# Funzione impostazione flag
def updateFlag(flag: str, value: bool):
    # Impostazione valore
    deviceState["flags"][flag] = value

# Funzione mappatura
def mapRange(x, in_min, in_max, out_min, out_max):
    # Controllo valori
    if in_max == in_min:
        raise TransientError("Range map failed (cannot divide by 0)")

    return (x - in_min) * (out_max - out_min) // (in_max - in_min) + out_min

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
    elif color == "magenta":
        r, g, b = 255, 0, 255
    elif color == "green":
        r, g, b = 0, 255, 0

    # Impostazione colore 
    deviceState["utils"]["pwms"][0].duty_u16(mapRange(r, 0, 255, 0, 65535))
    deviceState["utils"]["pwms"][1].duty_u16(mapRange(g, 0, 255, 0, 65535))
    deviceState["utils"]["pwms"][2].duty_u16(mapRange(b, 0, 255, 0, 65535))

# ---

# Funzione principale
def main():
    # Loop
    while True:

        # Controllo wifi e autenticazione
        if (deviceState["utils"]["wifi"].isconnected() and deviceState["token"]):
            return True

        elif deviceState["flags"]["wifiAttemps"] > 3 or deviceState["flags"]["authAttemps"] > 3:
            return False

        elif not deviceState["utils"]["wifi"].isconnected():
            # Controllo tempo passato
            if ticks_diff(ticks_ms(), deviceState["flags"]["lastWifiAttempt"]) > 15000:
                # Connessione wifi
                connWifi(3)
                # Impostazione flag
                updateFlag("lastWifiAttempt", ticks_ms())
                # Impostazione flag
                updateFlag("authAttempts", deviceState["flags"]["wifiAttemps"] + 1)

        elif not deviceState["token"]:
            # Controllo tempo passato
            if ticks_diff(ticks_ms(), deviceState["flags"]["lastAuthAttempt"]) > 15000:
                # Autenticatione
                authenticationConfig()
                # Impostazione flag
                updateFlag("lastAuthAttempt", ticks_ms())
                # Impostazione flag
                updateFlag("authAttempts", deviceState["flags"]["authAttemps"] + 1)

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
    print("-- CONFIG --")

    try:
        # Funzione configurazione
        config()

        # Funzione pricipale
        result = main()

        # Controllo configurazione versione
        if result:
            # Funzione configurazione versione
            versionConfig()

    except TransientError as e:
        print("Recoverable error:", e)

    except CriticalError as e:
        # Gestione errore
        criticError(e)

    except Exception as e:
        # Gestione errore
        criticError(e)

    # Pulizia profonda
    deepClean()