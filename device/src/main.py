# Importazione moduli
from machine import Pin, ADC, Timer, RTC, reset
from time import sleep, time
import dht, network, json, ubinascii, urandom, urequests, struct, ntptime, utime
import usocket as sk
from utils import loadData, syncTime, connWifi, login, connSocket, ws_send, ws_recv, irrigation, measure, sendMeasurement, printMeasurement, getSettings

# Creazione timer
tim = Timer(0)

# Creazione orario
rtc = RTC()
    
# Caricamento dati
[secrets, connInfo, settings, info] = loadData()

# Connessione wifi
wlan = connWifi(secrets["ssid"], secrets["psw"])

# Sincronizzazione orario
syncTime(rtc)

# Effettuazione login
loginData = login(connInfo["auth_url"], info["key"], info["psw"])

if loginData:
    token = loginData["accessToken"]
    newDevice = loginData["subject"]
else:
    reset()

# Controllo nuovo dispositivo
if newDevice != "":
    try:
        # Conversione dispositivo
        parsedInfo = {"id":info["id"], "key":info["key"], "psw":info["psw"], "name": newDevice["name"], "prototypeModel":info["prototypeModel"], "mode": newDevice["mode"]}
        
        # Sovrascrittura file
        with open("info.json", "w") as infoFile:
            info = parsedInfo
            infoFile.write(json.dumps(parsedInfo))
    except Exception as e:
        print("Errore nella sovrascrittura delle informazioni!")
        print(e, "\n")
else:
    print("Errore nella richiesta delle informazioni!")

# Richiesta nuove impostazioni
newSettings = getSettings(connInfo["api_url"], token)

# Controllo nuove impostazioni
if newSettings:
    try:
        # Conversione impostazioni
        parsedSettings = json.dumps(newSettings)
        
        # Sovrascrittura file
        with open("settings.json", "w") as settingsFile:
            settings = newSettings
            settingsFile.write(parsedSettings)
    except Exception as e:
        print(e, "\n")
        print("Errore nella sovrascrittura delle impostazioni!")
else:
    print("Errore nella richiesta delle impostazioni!")

# Connessione socket
sock = connSocket(connInfo["sk_ip"], connInfo["sk_port"], token)

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

# Funzione riconnessione websocket
def reconnect():
    global token, sock
    # Richesta connessione socket
    sock = connSocket(connInfo["sk_ip"], connInfo["sk_port"], token)

# Loop misurazioni
def measurementLoop():
    # Dichiarazione tempo corrente
    currentTime = f"{rtc.datetime()[0]:04d}-{rtc.datetime()[1]:02d}-{rtc.datetime()[2]:02d}T{rtc.datetime()[4]:02d}:{rtc.datetime()[5]:02d}:{rtc.datetime()[6]:02d}"
    
    # Calcolo humI
    humI = measure(sensor, 50) / 4095 * 100
    lum = measure(sensorLum, 50) / 4095 * 100

    # Calcolo humE e temp
    try:
        sensorOut.measure()
        temp = sensorOut.temperature()
        humE = sensorOut.humidity()
    except Exception as e:
        print("Errore DHT:", e)
        temp = None
        humE = None
    print(currentTime)
    
    def sendData():
        # Gestore errore invio dati
        try:     
            # Controllo dati
            if humI is not None and humE is not None and temp is not None and lum is not None and token and info["mode"] != "dev":
                # Invio misurazioni
                sendMeasurement(connInfo["api_url"], token, humI, humE, temp, lum, currentTime, info["mode"])
        except Exception as e:
            print("Errore nell'invio dei dati!")
            print(e)
    
    # Controllo modalità config
    if info["mode"] == "config":
        printMeasurement(humI, humE, temp, lum)
        sendData()
    # Controllo modalità auto
    elif info["mode"] == "auto" and token:
        printMeasurement(humI, humE, temp, lum)
        if settings["humMin"] > humI:
            irrigation(pump, info["name"], info["mode"], currentTime, token, connInfo["api_url"], sensor, sensorLum, sensorOut, humI, settings["humMax"], settings["interval"])
        else:
            sendData()
    
    # Attesa
    print("\n\n")
    
# Timer
tim.init(mode=Timer.PERIODIC, period=60000, callback=lambda t: measurementLoop())

# Loop principale
def mainLoop () :
    # Globalizzazione variabili
    global info, settings, token, sock, connInfo
    
    # Dichiarazione tempo corrente
    currentTime = f"{rtc.datetime()[0]:04d}-{rtc.datetime()[1]:02d}-{rtc.datetime()[2]:02d}T{rtc.datetime()[4]:02d}:{rtc.datetime()[5]:02d}:{rtc.datetime()[6]:02d}"
    
    # Ricezione evento
    event = ws_recv(sock, 0.1)
    
    # Controllo evento
    if type(event) is dict and "event" in event:        
        # Gestore evento irrigazione
        if event["event"] == "irrigation" and "duration" in event and token:            
            # Effettuazione irrigazione
            irrigation(pump, info["name"], info["mode"], currentTime, token, connInfo["api_url"], sensor, sensorLum, sensorOut, duration=event["duration"])
        elif event["event"] == "mode" and "mode" in event:
            try:
                if event["mode"] == "auto" and "info" in event:
                        print("Cambio modalità: AUTO")
                        print(f'Nuove impostazioni:\thumMin --> {event["info"]["humMin"]}\thumMax --> {event["info"]["humMax"]}\tinterval --> {event["info"]["interval"]}')
                        
                        # Nuove impostazioni
                        newSettings = {"deviceId": settings["deviceId"], "id": settings["id"], "interval": event["info"]["interval"], "humMax": event["info"]["humMax"], "createdAt": settings["createdAt"], "updatedAt": event["info"]["updatedAt"], "humMin": event["info"]["humMin"]}
                        
                        # Conversione impostazioni
                        parsedSettings = json.dumps(newSettings)
                        
                        # Sovrascrittura file
                        with open("settings.json", "w") as settingsFile:
                            settings = newSettings
                            settingsFile.write(parsedSettings)
                            
                        # Nuove informazioni
                        newInfo = {"key": info["key"], "psw": info["psw"], "name": info["name"], "prototypeModel": info["prototypeModel"], "id": info["id"], "mode": event["mode"]}
                            
                        # Conversione info
                        parsedInfo = json.dumps(newInfo)
                        
                        # Sovrascrittura file
                        with open("info.json", "w") as infoFile:
                            info = newInfo
                            infoFile.write(parsedInfo)

                elif event["mode"] == "config" or event["mode"] == "safe":
                        print(f'Cambio modalità: {event["mode"].upper()}')
                        
                        # Nuove informazioni
                        newInfo = {"key": info["key"], "psw": info["psw"], "name": info["name"], "prototypeModel": info["prototypeModel"], "id": info["id"], "mode": event["mode"]}
                            
                        # Conversione info
                        parsedInfo = json.dumps(newInfo)
                        
                        # Sovrascrittura file
                        with open("info.json", "w") as infoFile:
                            info = newInfo
                            infoFile.write(parsedInfo)
                    
                else:
                    print("Richiesta modifica modalità invalida!")
            except Exception as e:
                print(e, "\n")
                print("Errore nel cambio modalità!")
    # Controllo socket
    if sock:
        try:
            # Invio stato
            ws_send(sock, json.dumps({"event": "status", "data":{"lastSeen":currentTime}}))
        except Exception as e:
            print("Timeout durante ws_send:", e)
            print("Riconnessione WebSocket...")

            try:
                # Chiusura connessione
                sock.close()
            except:
                pass

            # Riconnessione
            reconnect()

# Esecuzione script
if __name__ == "__main__":
   while True:
       mainLoop()
       sleep(0.5)


