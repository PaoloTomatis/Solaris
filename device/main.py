# Importazione moduli
from machine import Pin, ADC, Timer, RTC, reset
from time import sleep
import dht, network, json
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
        print(".", end="")
    return wlan
    
# Funzione connessione socket
def connSocket(ip, port):
    # Configurazione socket
    s = sk.socket()
    print("\nConnessione al backend in corso...")

    # Connessione socket
    try:
        s.connect((ip, port))
        print("Connesso al backend!")
    except:
        print("Errore nella connessione con il backend!\n")
    return s
    
# Caricamento dati
[secrets, connInfo, settings, info] = loadData()

# Connessione wifi
wlan = connWifi(secrets["ssid"], secrets["psw"])

# Connessione socket
sock = connSocket(connInfo["sk_ip"], connInfo["sk_port"])

# Dichiarazione pompa
pump = Pin(26, Pin.OUT)

# Dichiarazione sensore suolo
sensor = ADC(Pin(32))
sensor.atten(ADC.ATTN_11DB)
sensor.width(ADC.WIDTH_12BIT)

# Dichiarazione sensore esterno
sensorOut = dht.DHT11(Pin(33))

# Funzione calcolo irrigazione
def irrigation(humI, humMax, interval):
    pump.on()
    print(round(((humMax - humI) * interval) * 1000))
    # tim.init(mode=Timer.ONE_SHOT, period=round(((humMax - humI) * interval) * 1000), callback=lambda t: pump.off())
    sleep(round(((humMax - humI) * interval)))
    pump.off()

# Funziona misurazione humI
def measureHumI(sensor, n=10):
    total = 0
    for _ in range(n):
        total += sensor.read()
    return total / n

# Loop principale
def mainLoop () :
    # Calcolo humI
    humI = measureHumI(sensor, 50) / 4095 * 100

    # Calcolo humE e temp
    try:
        sensorOut.measure()
        temp = sensorOut.temperature()
        humE = sensorOut.humidity()
    except Exception as e:
        print("Errore DHT:", e)
        temp = None
        humE = None
        
    print(f"{rtc.datetime()[2]}/{rtc.datetime()[1]}/{rtc.datetime()[0]} {rtc.datetime()[4]}:{rtc.datetime()[5]}:{rtc.datetime()[6]}")
    
    # Controllo modalità config
    if info["mode"] == "config":
        print(f"Umidità Interna: {round(humI)}")
        print(f"Umidità Esterna: {humE}")
        print(f"Temperatura: {temp}")
    # Controllo modalità auto
    elif info["mode"] == "auto":
        print(f"Umidità Interna: {round(humI)}")
        print(f"Umidità Esterna: {humE}")
        print(f"Temperatura: {temp}")
        if settings["humMin"] > humI:
            irrigation(humI, settings["humMax"], settings["interval"])
    
    print("\n\n")
    sleep(2)
    
if __name__ == "__main__":
    while True:
        mainLoop()