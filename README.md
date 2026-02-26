# Project Definition — SOLARIS

## Regole di base

- Tipo di progetto: IOT WebAPP
- Stack tecnologico: React (frontend), Node.js + Express (backend), MongoDB (database)
- Autenticazione: JWT
- Versione iniziale: v1.0
- Output previsto: tracker allenamenti e gestione dati utenti

## Obiettivi

- Obiettivo principale: Gestire l'irrigazione di una pianta
- Obiettivi secondari:
    - Calcolo delle soglie di umidità minima e massima
    - Registrazione di irrigazioni e misurazioni
    - Visualizzazione statistiche e notifiche
    - Collegamento utente a dispositivo

## Risorse

- **Componenti principali**
    - **Frontend**
        - Linguaggio / Framework --> Typescript - React
        - Funzionalità --> interfaccia utente per informazioni dispositivo, statistiche, impostazioni
        - Note --> responsive, accessibile, interazione in tempo reale con backend
    - **Backend**
        - Linguaggio / Framework --> Typescript - Node.js + Express
        - Funzionalità --> gestione dati, autenticazione, logica business
        - Note --> REST API, WebSocket, sicurezza JWT
    - **Database**
        - Tipo --> MongoDB
        - Funzionalità --> storage dati
        - Note --> no-sql per versionizzazione dati
    - **Device**
        - Linguaggio / Framework --> Micropython
        - Tipo --> ESP32
        - Funzionalità --> misurazioni con sensori, irrigazioni

## Installazione

- **Requisiti**
    - Installazione NODE
    - Installazione NPM
    - Installazione GIT
    - MongoDB installato e funzionante (necessario per lo storage dei dati del backend)
    - Dispositivo ESP32 (il modello supportato è Solaris Vega)
    - Installazione THONNY (necessario per caricare il firmware in Micropython)
- **Passaggi**
    1. Clonazione progetto --> git clone `https://github.com/PaoloTomatis/Solaris.git`
    2. Entrata nella directory principale --> `cd Solaris`
    3. Cambio directory per il client (React) --> `cd client`
    4. Installazione librerie client --> `npm install`
    5. Configurazione variabili d'ambiente client --> `cp .env.example .env` (necessario per gestire endpoint API e WebSocket)
    6. Cambio directory per il server (Node.js/Express) --> `cd ../server`
    7. Installazione librerie server --> `npm install`
    8. Configurazione variabili d'ambiente server (es. MongoDB URI, segreti JWT) --> `cp .env.example .env`
    9. Ritorno alla root del progetto --> `cd ..`
    10. Eseguire simultaneamente client e server (modalità sviluppo) --> `npm run dev`
    11. Aprire l'interfaccia web nel browser --> `http://xx.xx.xx.xx:3000` (IP mostrato in console, non localhost!)
    12. Cambio directory per il firmware del dispositivo --> `cd device/v2` (il progetto utilizza la versione v2 delle API)
    13. Configurazione identificativi dispositivo --> `cp deviceInfo.example.json deviceInfo.json`
    14. Configurazione indirizzo del server per il dispositivo --> `cp serverInfo.example.json serverInfo.json`
    15. Configurazione parametri iniziali (es. soglie umidità) --> `cp settings.example.json settings.json`
    16. Configurazione credenziali di rete --> `cp wifiInfo.example.json wifiInfo.json`
    17. Collegamento fisico del dispositivo ESP32 tramite USB-C
    18. Caricamento di tutti i file .py e .json tramite Thonny nella memoria del dispositivo
- **Note Aggiuntive**
    - Database: Assicurati che MongoDB sia attivo prima di avviare il server, poiché è lo stack tecnologico scelto per la persistenza dei dati di utenti, dispositivi, misurazioni e irrigazioni.
    - Autenticazione: Il primo avvio del dispositivo richiederà una procedura di bootstrap che include la sincronizzazione dell'orario e l'autenticazione JWT verso il server per ottenere le impostazioni operative.
    - Versionamento: Assicurati di utilizzare la cartella device/v2 per essere compatibile con l'attuale design delle API e dei protocolli WebSocket descritti.

## Modalità di sviluppo

- Branch principali:
    - **main** — versione stabile
    - **feature/** — sviluppo funzionalità
- Testing:
    - in fase di implementazione
- Deploy:
    - in fase di implementazione
