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

## Modalità di sviluppo

- Branch principali:
    - **main** — versione stabile
    - **feature/** — sviluppo funzionalità
- Testing:
    - in fase di implementazione
- Deploy:
    - in fase di implementazione
