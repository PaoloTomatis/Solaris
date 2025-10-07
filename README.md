# **SOLARIS☀️**

### _Indice_

-   [Descrizione](#descrizione)
-   [Installazione](#installazione)
-   [Funzionalità](#funzionalità)
-   [Logica](#logica)
-   [Algoritmo Irrigazione](#algoritmo-irrigazione)
-   [Pagine Solaris Hub](#pagine-solaris-hub)
-   [Palette Solaris Hub](#palette-solaris-hub)
-   [Database Solaris Hub](#database-solaris-hub)
-   [Hardware Solaris Vega](#hardware-solaris-vega)
-   [Contatti](#contatti)

### _Descrizione_

Solaris è un sistema scalabile orientato alla automatizzazione di una serra, gestendo tramite diversi sensori la crescita di una pianta. Esso comprende una parte hardware con un microcontrollore e dei sensori insieme ad una parte software con un portale web dove poter osservare le statistiche della propria coltura e gestire l'automazione

### _Installazione_

Per testare Solaris bisogna utilizzare questi comandi nel terminale (avendo già installato MICROPYTHON, NODE, NPM e GIT):

1. Clonazione progetto --> `git clone https://github.com/PaoloTomatis/Solaris.git`
2. Cambio directory --> `cd ./Solaris/client`
3. Installazione librerie --> `npm install`
4. Variabili d'ambiente (bisogna aprirlo e modificare i dati in base ai propri) --> `cp .env.example .env`
5. Cambio directory --> `cd ../server`
6. Installazione librerie --> `npm install`
7. Variabili d'ambiente (bisogna aprirlo e modificare i dati in base ai propri) --> `cp .env.example .env`
8. Aprire due terminali
9. Entrare nella directory /client
10. Eseguire il client --> `npm run dev`
11. Entrare nella directory /server
12. Eseguire il server --> `npm run dev`
13. Aprire il link --> `http://localhost:3000`

### _Funzionalità_

-   modificare, visualizzare MODALITA'
-   creare, eliminare, accedere, uscire, visualizzare ACCOUNT
-   visualizzare, eliminare LOG
-   visualizzare STATISTICHE
-   controllare, inserire CHIAVI
-   visualizzare IRRIGAZIONI
-   visualizzare, modificare SOGLIE IRRIGAZIONI
-   impostare IRRIGAZIONE (in modalità config)

### _Logica_

-   BOOTSTRAP \
    DEVICE --> richiesta autenticazione al server \
    SERVER --> autenticazione del device \
    SERVER --> invio evento al device \
    DEVICE --> cambio modalità (fornita dal server)

-   mod1. CONFIG\
    DEVICE --> attesa evento irrigazione \
    CLIENT --> premuto tasto irrigazione \
    CLIENT --> invio segnale al server \
    SERVER --> invio segnale al device \
    DEVICE --> lettura dati sensori \
    DEVICE --> irrigazione \
    DEVICE --> attesa 90'' \
    DEVICE --> lettura dati sensori \
    DEVICE --> invio dati al server \
    SERVER --> salvataggio dati nel database

-   TRANSIZIONE config --> auto \
    CLIENT --> premuto tasto automazione \
    CLIENT --> invio segnale al server \
    SERVER --> controllo dati raccolti \
    SERVER --> esecuzione algoritmo per soglie \
    SERVER --> salvataggio dati nel database \
    SERVER --> invio soglie al device \
    DEVICE --> salvataggio soglie in memoria locale

-   mod2. AUTO \
    DEVICE --> lettura dati sensori ogni 300'' \
    DEVICE --> invio dati al server \
    SERVER --> salvataggio dati nel database \
    DEVICE --> controllo soglie \
    DEVICE --> irrigazione in base ai dati \
    DEVICE --> attesa 90'' \
    DEVICE --> lettura dati sensori \
    DEVICE --> invio dati al server \
    SERVER --> salvataggio dati nel database

-   mod3. SAFE \
    DEVICE --> lettura dati sensori ogni 600'' \
    DEVICE --> invio dati al server \
    SERVER --> salvataggio dati nel database \
    CLIENT --> visualizzazione log errore

-   errore1. TANICA ACQUA VUOTA \
    DEVICE --> lettura dati sensori \
    DEVICE --> irrigazione in base ai dati \
    DEVICE --> attesa 90'' \
    DEVICE --> lettura dati sensori \
    DEVICE --> dati sensori 2 = dati sensori 1 \
    DEVICE --> cambio modalità in safe (tanica acqua vuota) \
    DEVICE --> invio dati al server \
    SERVER --> salvataggio dati nel database

-   errore2. COLLEGAMENTO WIFI \
    DEVICE --> collegamento wifi non avvenuto \
    DEVICE --> salvataggio log errore in memoria locale (in attesa connessione) \
    DEVICE --> salvataggio dati in memoria locale (in attesa connessione) \
    DEVICE --> 10 tentativi di connessione ogni 600'' \
    DEVICE --> invio dati al server \
    SERVER --> salvataggio dati nel database

### _Algoritmo Irrigazione_

-   HUM-MAX e HUM-MIN (la differenza tra i due sono i set di dati utilizzati)

    -   1. Calcolo mediana tra i dati \
           _**es.** 25 25 27 **28 29** 29 35 35_
    -   2. Assegnazione peso \
           _**Formula** --> p = nDati / 2 - pos (se nDati è pari) | p = nDati / 2 + 0.5 - pos (se nDati è dispari)_ \
           _**es**. 29 --> p = 8 / 2 - 1 = 3_
    -   3. Calcolo media ponderata \
           _**Formula** --> pTot = pMax \* (pMax + 1) (se nDati è pari) | pTot = pMax^2 (se nDati è dispari)_ \
           _**es**. humMin = ( 25 * 1 + 25 * 2 + 27 \* 3 + ...) / 20_

-   K-INTERVAL (calcolo soglie)

    -   1. Calcolo media aritmetica tra gli intervalli \
           _**es.** intervals = (120 + 135 + 115 + 120 + 120) / 5 = 120s_
    -   2. Calcolo media aritmetica tra le variazioni di umidità \
           _**es**. Δhum = ((75 + 80 + 70) - (20 + 25 + 35)) / 3 = 48.3%_
    -   3. Calcolo coefficiente d'intervallo \
           _**Formula** --> kInterval = intervals / Δhum_ \
           _**es**. kInterval = 122 / 48.3 = 2.5258_

-   K-INTERVAL (auto-correzione)
    -   1. Calcolo errore relativo \
           _**Formula** --> error = (humMax - humI2) / (humMax - humI1)_ \
           _**es.** error = (70 - 67) / (70 - 30) = 0.075_
    -   2. Calcolo nuovo coefficiente d'intervallo \
           _**Formula** --> kIntervalNew = kInterval + (kInterval * error * 0.05)_ \
           _**es.** kIntervalNew = 2.5258 + (2.5258 * 0.075 * 0.05) = 2.5353_
    -   3. Calcolo coefficiente d'intervallo massimo e minimo \
           _**Formula** --> kIntervalMax = kInterval * 110/100 | kIntervalMin = kInterval * 90/100_ \
           _**es.** kIntervalMax = 2.5258 * 110/100 = 2.7784 | kIntervalMin = 2.5258 * 90/100 = 2.2732_
    -   4. Controllo coefficiente d'intervallo nuovo \
           _**Formula** --> kIntervalMin < kIntervalNew < kIntervalMax_ \
           _**es.** 2.2732 < 2.5353 < 2.7784_

### _Pagine Solaris Hub_

-   /auth/login --> accesso account
-   /auth/signup --> registrazione account
-   /account --> informazione e controlli account
-   /settings --> impostazioni account
-   /credits --> crediti
-   /policy --> privacy e cookie policy
-   /dashboard --> selezione e configurazione device
-   /dashboard/:id --> informazioni device
-   /dashboard/:id/controls --> controllo device
-   /dashboard/:id/settings --> impostazioni device
-   /dashboard/:id/log --> eventi device
-   /dashboard/:id/stats --> statistiche device
-   /\* --> errori 404

### _Palette Solaris Hub_

_Colore_ --> _mod. Chiara_ | _mod. Scura_ (i pallini colorati non sono accurati):

-   Primario --> 🔵 #00A9A5 | 🔵 #00D4D8
-   Secondario --> 🟡 #FFD60A | 🟡 #FFE34D
-   Decorazione --> 🔵 #9333EA | 🔵 #A855F7
-   Sfondo Primario --> ⚪ #F8FAFC | ⚫ #0F172A
-   Sfondo Elementi --> ⚪ #FFFFFF | ⚫ #1E293B
-   Testo Primario --> ⚫ #111827 | ⚪ #F1F5F9
-   Testo Secondario --> ⚫ #4B5563 | 🔵 #94A3B8
-   Successo --> 🟢 #16A34A | 🟢 #22C55E
-   Info --> 🔵 #2563EB | 🔵 #3B82F6
-   Avviso --> 🟡 #F59E0B | 🟡 #FBBF24
-   Errore --> 🔴 #DC2626 | 🔴 #EF4444

### _Database Solaris Hub_

-   Utenti --> users (id, email, role, psw, refresh_token, createdAt, updatedAt)
-   Dispositivi --> devices (id, key, psw, name, prototype, userId, mode, activatedAt, createdAt, updatedAt)
-   Dati --> data (id, desc, link, read, date, humI, humE, temp, lum, kInterval, deviceId, type, createdAt, updatedAt)
-   Impostazioni Dispositivi --> device_settings (id, humMax, humMin, kInterval, deviceId, createdAt, updatedAt)
-   Impostazioni Utente --> user_settings (id, styleMode, units, userId, createdAt, updatedAt)

### _Hardware Solaris Vega V1_

-   ESP32
-   Breadboard
-   DHT11
-   Sensore Umidità Suolo Resistivo
-   Fotoresistenza
-   Resistenze
-   Led
-   Buzzer
-   Pompa
-   Power Supply
-   Mosfet / Relè
-   Diodo
-   Jumper Wires

### _Contatti_

Per consigli, dubbi o problemi è possibile contattarmi qui:

-   Email🟣: [tomatis.pol@gmail.com](mailto:tomatis.pol@gmail.com)
-   Discord🔵: [pol_tomatis](https://discord.com/users/792080055236821013)
-   GitHub⚪: [PaoloTomatis](https://github.com/PaoloTomatis)
-   Instagram🔴: [paolo_tom](https://www.instagram.com/paolo__tom/)
