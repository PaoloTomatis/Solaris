# **SOLARIS☀️**

### _Indice_

-   [Descrizione](#descrizione)
-   [Funzionalità](#funzionalità)
-   [Logica](#logica)
-   [Installazione](#installazione)
-   [Pagine Solaris Hub](#pagine-solaris-hub)
-   [Palette Solaris Hub](#palette-solaris-hub)
-   [Database Solaris Hub](#database-solaris-hub)
-   [Hardware Solaris Vega](#hardware-solaris-vega)
-   [Contatti](#contatti)

### _Descrizione_

Solaris è un sistema scalabile orientato alla automatizzazione di una serra, gestendo tramite diversi sensori la crescita di una pianta. Esso comprende una parte hardware con un microcontrollore e dei sensori insieme ad una parte software con un portale web dove poter osservare le statistiche della propria coltura e gestire l'automazione

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
    SERVER --> salvataggio dati nel database _(data(id: -, desc: ..., link: /dashboard/1/controls, read: false, date: 2025-08-28T11:42:43.158Z, hum_i: [25, 75], hum_e: 56, temp: 23, device_id: 1, type: irrigation_config))_ \

-   TRANSIZIONE \
    CLIENT --> premuto tasto automazione \
    CLIENT --> invio segnale al server \
    SERVER --> controllo dati raccolti \
    SERVER --> esecuzione algoritmo per soglie \
    SERVER --> salvataggio dati nel database _(device_settings(id: -, hum_max: 80, hum_min: 23, interval: 27, device_id: 1, updated_at: 2025-08-29T09:25:45.225Z))_ \
    SERVER --> invio soglie al device \
    DEVICE --> salvataggio soglie in memoria locale \

-   mod2. AUTO \
    DEVICE --> lettura dati sensori ogni 90'' \
    DEVICE --> invio dati al server \
    SERVER --> salvataggio dati nel database _(data(id: -, desc: ..., link: /dashboard/1, read: false, date: 2025-09-12T07:32:59.618Z, hum_i: 43, hum_e: 60, temp: 19, device_id: 1, type: data))_ \
    DEVICE --> controllo soglie \
    DEVICE --> irrigazione in base ai dati \
    DEVICE --> attesa 90'' \
    DEVICE --> lettura dati sensori \
    DEVICE --> invio dati al server \
    SERVER --> salvataggio dati nel database _(data(id: -, desc: ..., link: /dashboard/1, read: false, date: 2025-09-12T10:43:27.642Z, hum_i: [24, 65], hum_e: 57, temp: 24, device_id: 1, type: irrigation_auto))_ \

-   mod3. SAFE \
    DEVICE --> lettura dati sensori ogni 120'' \
    DEVICE --> invio dati al server \
    DEVICE --> invio log errore al server \
    SERVER --> salvataggio dati nel database _(data(id: -, desc: ..., link: /dashboard/1, read: false, date: 2025-09-12T07:32:59.618Z, hum_i: 43, hum_e: 60, temp: 19, device_id: 1, type: data))_ \
    CLIENT --> visualizzazione log errore \

-   BOOTSTRAP \
    DEVICE --> richiesta autenticazione al server \
    SERVER --> autenticazione del device \
    SERVER --> invio evento al device \
    DEVICE --> cambio modalità (fornita dal server) \

-   errore1. TANICA ACQUA VUOTA \
    DEVICE --> lettura dati sensori \
    DEVICE --> irrigazione in base ai dati \
    DEVICE --> lettura dati sensori \
    DEVICE --> dati sensori 2 = dati sensori 1 \
    DEVICE --> cambio modalità in safe (tanica acqua vuota) \
    SERVER --> salvataggio dati nel database \

-   errore2. COLLEGAMENTO WIFI \
    DEVICE --> lettura dati sensori ogni 90'' \
    DEVICE --> collegamento wifi non avvenuto \
    DEVICE --> utilizzo soglie in memoria locale \
    DEVICE --> irrigazione in base ai dati \
    DEVICE --> salvataggio dati in memoria locale (in attesa connessione) \

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

### _Pagine Solaris Hub_

-   /auth/login --> accesso account
-   /auth/signup --> registrazione account
-   /account --> informazione e controlli account
-   /credits --> crediti
-   /policy --> privacy e cookie policy
-   /dashboard --> selezione e configurazione device
-   /dashboard/:id --> informazioni device
-   /dashboard/:id/live --> dati live device
-   /dashboard/:id/controls --> controllo device
-   /dashboard/:id/settings --> impostazioni device
-   /data/log/:id --> eventi device
-   /data/stats/:id --> statistiche device
-   /\* --> errori 404

### _Palette Solaris Hub_

_Colore_ --> _mod. Chiara_ | _mod. Scura_ (i pallini colorati non sono accurati):

-   Primario --> #00A9A5 | #00D4D8
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

-   Utenti --> users (id, email, psw, refresh_token, created_at)
-   Dispositivi --> devices (id, key, model, activated, user_id, mode)
-   Dati --> data (id, desc, link, read, date, hum_i, hum_e, temp, device_id, type)
-   Impostazioni Dispositivi --> device_settings (id, hum_max, hum_min, interval, device_id, updated_at)

### _Hardware Solaris Vega_

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
