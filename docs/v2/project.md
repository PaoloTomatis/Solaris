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

## Flussi principali

- **Bootstrap**
    - Device --> caricamento informazioni locali
    - Device --> connessione wifi
    - Device --> sincronizzazione orario
    - Device --> richiesta autenticazione al server
    - Server --> autenticazione del device
    - Device --> richiesta impostazioni al server
    - Server --> invio impostazioni al device
    - Device --> salvataggio impostazioni in locale
    - Device --> connessione al server WS
    - Server --> autenticazione del device per WS

- **Mainloop - Config**
    - Device --> attesa 60s
    - Device --> misurazioni con sensori
    - Device --> controllo temperatura sicura (2°C - 30°C)
    - Device --> controllo umidità sicura (30% - 85%)
    - Device --> invio misurazioni al server
    - Server --> salvataggio misurazioni nel database
    - Server --> invio misurazioni al client via WS

- **Mainloop - Auto**
    - Device --> attesa 60s
    - Device --> misurazioni con sensori
    - Device --> controllo temperatura sicura (2°C - 30°C)
    - Device --> controllo umidità sicura (30% - 85%)
    - Device --> controllo umidità suolo (in base alle impostazioni)
    - Device --> irrigazione (in base alle impostazioni)
    - Device --> invio irrigazione al server
    - Server --> salvataggio irrigazione nel database
    - Server --> calcolo nuove impostazioni
    - Server --> salvataggio nuove impostazioni nel database
    - Server --> invio nuove impostazioni al device via WS

- **Mainloop - Safe**
    - Device --> attesa 60s
    - Device --> misurazioni con sensori
    - Device --> controllo temperatura sicura (2°C - 30°C)
    - Device --> controllo umidità sicura (30% - 85%)

- **Mainloop Generale**
    - Device --> invio stato al server via WS
    - Server --> invio stato al client via WS
    - Device --> attesa eventi WS

## Modalità di sviluppo

- Branch principali:
    - **main** — versione stabile
    - **feature/** — sviluppo funzionalità
- Testing:
    - in fase di implementazione
- Deploy:
    - in fase di implementazione
