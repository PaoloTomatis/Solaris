# Client Documentation — SOLARIS

## Regole di base

- Tipo client: Web
- Framework / Libreria principale: React
- Versione: v1
- Comunicazione: HTTP / WebSocket
- Formato dati: JSON
- Autenticazione gestita: JWT

## Architettura

- **Struttura generale**
    - Routing --> Client-side
    - Gestione API --> axios
    - Gestione autenticazione --> token storage, refresh automatico

## Pagine

- **Homepage**
    - Url --> `/`
    - Protetto --> ❌
    - Note --> mostra le informazioni generali del progetto

- **Login**
    - Url --> `/auth/login`
    - Protetto --> ❌
    - Note --> permette il login dell'utente
    - Chiamate API
        1. `POST /auth/v2/user-login` --> pulsante con compilazione campi

- **Signup**
    - Url --> `/auth/signup`
    - Protetto --> ❌
    - Note --> permette la registrazione dell'utente
    - Chiamate API
        1. `POST /auth/v2/user-register` --> pulsante con compilazione campi

- **Account**
    - Url --> `/account`
    - Protetto --> ✔️
    - Note --> mostra le informazioni dell'utente autenticato (salvate nel context apposito)

- **UserSettings**
    - Url --> `/settings`
    - Protetto --> ✔️
    - Note --> mostra e permette di modificare le impostazioni dell'utente
    - Chiamate API
        1. `PATCH /api/v2/user-settings` --> pulsante con compilazione campi

- **Credits**
    - Url --> `/credits`
    - Protetto --> ❌
    - Note --> mostra i crediti delle icone

- **Privacy Policy**
    - Url --> `/privacy`
    - Protetto --> ❌
    - Note --> mostra le informazioni sulla privacy (al momento redirect verso `/warning`)

- **Cookie Policy**
    - Url --> `/cookies`
    - Protetto --> ❌
    - Note --> mostra le informazioni sui cookies (al momento redirect verso `/warning`)

- **Warning**
    - Url --> `/warning`
    - Protetto --> ❌
    - Note --> mostra l'avviso e la responsabilità dell'utente

- **Devices**
    - Url --> `/devices`
    - Protetto --> ✔️
    - Note --> mostra i dispositivi appartenenti all'utente autenticato
    - Chiamate API
        1. `GET /api/v2/devices` --> al caricamento
        2. `WS v2/status` --> per stato dispositivi dell'utente

- **DeviceRegister**
    - Url --> `/devices/add`
    - Protetto --> ✔️
    - Note --> permette di collegare un dispositivo data la sua chiave
    - Chiamate API
        1. `PATCH /api/v2/devices/activate` --> pulsante con compilazione campi

- **Dashboard**
    - Url --> `/dashboard/:id`
    - Protetto --> ✔️
    - Note --> mostra le informazioni di un dispositivo appartenente all'utente autenticato
    - Chiamate API
        1. `GET /api/v2/notifications` --> al caricamento
        2. `GET /api/v2/devices` --> al caricamento
        3. `GET /api/v2/measurements` --> al caricamento
        4. `WS v2/status` --> per stato dispositivo selezionato

- **Controls**
    - Url --> `/dashboard/:id/controls`
    - Protetto --> ✔️
    - Note --> permette di effettuare l'irrigazione manuale
    - Chiamate API
        1. `POST /api/v2/irrigations/execute` --> pulsante con compilazione campi

- **DeviceSettings**
    - Url --> `/dashboard/:id/settings`
    - Protetto --> ✔️
    - Note --> mostra e permette di modificare le impostazioni del dispositivo
    - Chiamate API
        1. `GET /api/v2/devices-settings` --> al caricamento
        2. `GET /api/v2/devices` --> al caricamento
        3. `PATCH /api/v2/devices` --> pulsante con compilazione campi
        4. `PATCH /api/v2/devices-settings` --> pulsante con compilazione campi
        5. `DELETE /api/v2/notifications` --> pulsante con compilazione campi
        6. `DELETE /api/v2/measurements` --> pulsante con compilazione campi
        7. `DELETE /api/v2/irrigations` --> pulsante con compilazione campi
        8. `DELETE /api/v2/notifications` --> pulsante con compilazione campi

- **Logs**
    - Url --> `/dashboard/:id/log`
    - Protetto --> ✔️
    - Note --> mostra i log del dispositivo selezionato
    - Chiamate API
        1. `GET /api/v2/notifications` --> al caricamento

- **Irrigations**
    - Url --> `/dashboard/:id/irrigations`
    - Protetto --> ✔️
    - Note --> mostra le irrigazioni del dispositivo selezionato
    - Chiamate API
        1. `GET /api/v2/irrigations` --> al caricamento

- **Measurements**
    - Url --> `/dashboard/:id/measurements`
    - Protetto --> ✔️
    - Note --> mostra le misurazioni del dispositivo selezionato
    - Chiamate API
        1. `GET /api/v2/measurements` --> al caricamento

- **Stats**
    - Url --> `/dashboard/:id/stats`
    - Protetto --> ✔️
    - Note --> in produzione

- **Errore 404**
    - Url --> `/*`
    - Protetto --> ❌
    - Note --> mostra errore per pagina non esistente

## UI / UX

- Responsive --> ❌ (fisso per mobile)
- Accessibilità --> in fase di implementazione
- Feedback utente:
    - Loading states
    - Error messages
    - Success notifications
- Tema --> Light / Dark

## Testing

- Unit test --> in fase di implementazione
- UI test --> in fase di implementazione
- End-to-end --> in fase di implementazione
- Coverage minimo --> in fase di implementazione
