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
    newDevice = loginData["device"]
else:
    reset()

# Controllo nuove info dispositivo
if newDevice != "":
    try:
        # Conversione dispositivo
        parsedInfo = {"id":newDevice["id"], "key":info["key"], "psw":info["psw"], "name": newDevice["name"], "prototypeModel":newDevice["prototypeModel"]}
        
        # Sovrascrittura file
        with open("info.json", "w") as infoFile:
            info = parsedInfo
            infoFile.write(json.dumps(parsedInfo))
    except Exception as e:
        print("Device info writing error: ", e, "\n")

# Richiesta impostazioni
newSettings = getSettings(connInfo["api_url"], token)

# Controllo impostazioni
if newSettings:
    try:
        # Conversione impostazioni
        parsedSettings = json.dumps(newSettings)
        
        # Sovrascrittura file
        with open("settings.json", "w") as settingsFile:
            settings = newSettings
            settingsFile.write(parsedSettings)
    except Exception as e:
        print("Device settings writing error", e, "\n")

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
    
    # Misurazioni
    humI = measure(sensor, 50) / 4095 * 100
    lum = measure(sensorLum, 50) / 4095 * 100
    try:
        sensorOut.measure()
        temp = sensorOut.temperature()
        humE = sensorOut.humidity()
    except Exception as e:
        print("DHT error:", e, "\n")
        temp = None
        humE = None
    print(currentTime)
    
    # Controllo modalità config
    if settings["mode"] == "config":
        # Stampo misurazioni
        printMeasurement(humI, humE, temp, lum)
        # Invio misurazioni
        sendMeasurement(connInfo["api_url"], token, humI, humE, temp, lum, currentTime)
    # Controllo modalità auto
    elif settings["mode"] == "auto" and token:
        # Stampo misurazioni
        printMeasurement(humI, humE, temp, lum)
        # Controllo umidità minima
        if settings["humIMin"] > humI:
            # Irrigazione
            irrigation(pump, info["name"], info["mode"], currentTime, token, connInfo["api_url"], sensor, sensorLum, sensorOut, humI, settings["humMax"], settings["interval"])
        else:
            # Invio misurazioni
            sendMeasurement(connInfo["api_url"], token, humI, humE, temp, lum, currentTime, info["mode"])
    
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
            irrigation(pump, info["name"], settings["mode"], currentTime, token, connInfo["api_url"], sensor, sensorLum, sensorOut, duration=event["duration"])
        elif event["event"] == "mode" and "mode" in event:
            try:
                if event["mode"] == "auto" and "info" in event:
                    print(f'New mode: {event["mode"].upper()}')
                    print(f'New settings:\thumIMin --> {event["info"]["humIMin"]}\thumIMax --> {event["info"]["humIMax"]}\tkInterval --> {event["info"]["kInterval"]}')

                    # Nuove informazioni
                    newSettings = {"humIMax": event["info"]["humIMax"], "humIMin": event["info"]["humIMin"], "kInterval": event["info"]["kInterval"], "mode": event["mode"]}
                        
                    # Conversione info
                    parsedSettings = json.dumps(newSettings)
                    
                    # Sovrascrittura file
                    with open("settings.json", "w") as settingsFile:
                        settings = newSettings
                        settingsFile.write(parsedSettings)

                elif event["mode"] == "config" or event["mode"] == "safe":
                    print(f'New mode: {event["mode"].upper()}')
                    
                    # Nuove informazioni
                    newSettings = {"humIMax": settings["humIMax"], "humIMin": info["humIMin"], "kInterval": info["kInterval"], "mode": event["mode"]}

                    # Conversione info
                    parsedSettings = json.dumps(newSettings)
                    
                    # Sovrascrittura file
                    with open("settings.json", "w") as settingsFile:
                        settings = newSettings
                        settingsFile.write(parsedSettings)
                    
                else:
                    print("Invalid mode request\n")
            except Exception as e:
                print("Error changing mode: ", e, "\n")
    
    # Controllo socket
    if sock:
        try:
            # Invio stato
            ws_send(sock, json.dumps({"event": "v2/status", "data":{"lastSeen":currentTime}}))
        except Exception as e:
            print("Error sending WS event:", e)
            print("WS reconnection")

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
