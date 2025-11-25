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
loginData = login(connInfo["api_url"], info["key"], info["psw"])

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
    
    # Controllo modalità config
    if info["mode"] == "config":
        printMeasurement(humI, humE, temp, lum)
    # Controllo modalità auto
    elif info["mode"] == "auto" and token:
        printMeasurement(humI, humE, temp, lum)
        if settings["humMin"] > humI:
            irrigation(pump, info["name"], info["mode"], currentTime, token, connInfo["api_url"], sensor, sensorLum, sensorOut, humI, settings["humMax"], settings["interval"])
    
    # Gestore errore invio dati
    try:                    
        # Controllo dati
        if humI is not None and humE is not None and temp is not None and lum is not None and token and info["mode"] != "dev":
            # Invio misurazioni
            sendMeasurement(connInfo["api_url"], token, humI, humE, temp, lum, currentTime, info["mode"])
    except Exception as e:
        print("Errore nell'invio dei dati!")
        print(e)
    
    # Attesa
    print("\n\n")
    
# Timer
tim.init(mode=Timer.PERIODIC, period=60000, callback=lambda t: measurementLoop())

# Loop principale
def mainLoop () :
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
            
    # Controllo socket
    if sock:
        # Invio stato
        ws_send(sock, json.dumps({"event": "status", "data":{"lastSeen":currentTime}}))

# Esecuzione script
if __name__ == "__main__":
   while True:
       mainLoop()
       sleep(0.5)
