# API Design — SOLARIS

## Regole di base

- Protocollo: HTTP / WS
- Formato: JSON
- Autenticazione: JWT, l’identità del soggetto (user o device) viene sempre risolta dal token di accesso
- Versione: v2
- Output Successo: `{ data: {...} }` (... specificata dal campo [Output])
- Output Errore: `{ message: string }`

## Risorse

- **Users**
    - **_GET_ /me**:
        - Autore --> user
        - Output --> `{ id, email, updatedAt, createdAt }`
        - Note --> l'utente restituito è quello autenticato
        - Autenticazione --> ✔️
        - Protocollo --> http

    - **_DELETE_ /me**:
        - Autore --> user
        - Output --> `null`
        - Note --> l'utente eliminato è quello autenticato
        - Autenticazione --> ✔️
        - Protocollo --> http

- **Devices**
    - **_GET_ /devices/:deviceId**:
        - Autore --> user
        - Params --> `/:id`
        - Output --> `{ id, userId, name, prototypeModel, activatedAt, updatedAt, createdAt }`
        - Note --> il dispositivo deve essere posseduto dall'utente
        - Autenticazione --> ✔️
        - Protocollo --> http

    - **_GET_ /devices**:
        - Autore --> user
        - Query --> `? userId & from & to & limit & sort &`
        - Output --> `{ id, userId, name, prototypeModel, activatedAt, updatedAt, createdAt }`
        - Note --> il dispositivo deve essere posseduto dall'utente
        - Autenticazione --> ✔️
        - Protocollo --> http

    - **_POST_ /devices**:
        - Autore --> user (admin)
        - Body --> `{ key?, name?, psw?, prototypeModel }`
        - Output --> `{ id, userId, name, prototypeModel, activatedAt, updatedAt, createdAt }`
        - Note --> l'utente deve essere un amministratore
        - Autenticazione --> ✔️
        - Protocollo --> http

    - **_PATCH_ /devices/activate/:key**:
        - Autore --> user
        - Params --> `/:key`
        - Body --> `{ name }`
        - Output --> `{ id, userId, name, prototypeModel, activatedAt, updatedAt, createdAt }`
        - Note --> il dispositivo non deve essere posseduto da alcun utente
        - Autenticazione --> ✔️
        - Protocollo --> http

    - **_PATCH_ /devices/:deviceId**:
        - Autore --> user
        - Params --> `/:id`
        - Body --> `{ name? }`
        - Output --> `{ id, userId, name, prototypeModel, activatedAt, updatedAt, createdAt }`
        - Note --> il dispositivo deve essere posseduto dall'utente
        - Autenticazione --> ✔️
        - Protocollo --> http

    - **_DELETE_ /devices/:deviceId**:
        - Autore --> user (admin)
        - Params --> `/:id`
        - Output --> `null`
        - Note --> l'utente deve essere un amministratore
        - Autenticazione --> ✔️
        - Protocollo --> http

    - **INPUT v2/status**:
        - Autore --> device
        - Body --> `{ event, lastSeen }`
        - Autenticazione --> ✔️
        - Protocollo --> ws

    - **OUTPUT v2/status**:
        - Ricevente --> user
        - Ouput --> `{ event, deviceId, lastSeen }`
        - Autenticazione --> ✔️
        - Protocollo --> ws

- **Irrigations**
    - **_GET_ /irrigations**:
        - Autore --> user
        - Query --> `? deviceId & from & to & limit & sort & type`
        - Output --> `{ id, deviceId, temp, lum, humE, humIBefore, humIAfter, interval, type, irrigatedAt, updatedAt, createdAt }`
        - Note --> il dispositivo deve essere posseduto dall'utente
        - Autenticazione --> ✔️
        - Protocollo --> http

    - **_POST_ /irrigations/execute**:
        - Autore --> user
        - Body --> `{ interval, deviceId }`
        - Output --> `null`
        - Note --> il dispositivo deve essere posseduto dall'utente e deve essere in modalità configurazione
        - Autenticazione --> ✔️
        - Protocollo --> http

    - **_POST_ /irrigations**:
        - Autore --> device
        - Body --> `{ temp, lum, humE, humIBefore, humIAfter, interval, type, irrigatedAt }`
        - Output --> `{ id, deviceId, temp, lum, humE, humIBefore, humIAfter, interval, type, irrigatedAt, updatedAt, createdAt }`
        - Note --> il dispositivo deve essere posseduto da un utente
        - Autenticazione --> ✔️
        - Protocollo --> http

    - **_DELETE_ /irrigations**:
        - Autore --> user
        - Query --> `? deviceId`
        - Output --> `null`
        - Note --> il dispositivo deve essere posseduto dall'utente
        - Autenticazione --> ✔️
        - Protocollo --> http

    - **OUTPUT v2/irrigation**:
        - Ricevente --> device
        - Body --> `{ event, interval }`
        - Note --> inviato a seguito di una richiesta di irrigazione manuale (solo se attivo in quel momento)
        - Autenticazione --> ✔️
        - Protocollo --> ws

- **Measurements**
    - **_GET_ /measurements**:
        - Autore --> user
        - Query --> `? deviceId & from & to & limit & sort`
        - Output --> `{ id, deviceId, temp, lum, humE, humI, measuredAt, updatedAt, createdAt }`
        - Note --> il dispositivo deve essere posseduto dall'utente
        - Autenticazione --> ✔️
        - Protocollo --> http

    - **_POST_ /measurements**:
        - Autore --> device
        - Body --> `{ temp, lum, humE, humI, measuredAt }`
        - Output --> `{ id, deviceId, temp, lum, humE, humI, measuredAt, updatedAt, createdAt }`
        - Note --> il dispositivo deve essere posseduto da un utente
        - Autenticazione --> ✔️
        - Protocollo --> http

    - **_DELETE_ /measurements**:
        - Autore --> user
        - Query --> `? deviceId`
        - Output --> `null`
        - Note --> il dispositivo deve essere posseduto dall'utente
        - Autenticazione --> ✔️
        - Protocollo --> http

    - **OUTPUT v2/measurements**:
        - Ricevente --> device
        - Body --> `{ event, data }`
        - Note --> inviato al proprietario del dispositivo a seguito di una misurazione (solo se attivo in quel momento)
        - Autenticazione --> ✔️
        - Protocollo --> ws

- **Notifications**
    - **_GET_ /notifications**:
        - Autore --> user
        - Query --> `? deviceId & from & to & limit & sort & type`
        - Output --> `{ id, irrigationId, measurementId, deviceId, title, description, type, updatedAt, createdAt }`
        - Note --> la notifica deve essere posseduta dall'utente, il dispositivo da cui provengono l'irrigazione o la misurazione deve essere posseduto dall'utente
        - Autenticazione --> ✔️
        - Protocollo --> http

    - **_POST_ /notifications**:
        - Autore --> device
        - Body --> `{ irrigationId?, measurementId?, title, description, type }`
        - Output --> `{ id, irrigationId, measurementId, deviceId, title, description, type, updatedAt, createdAt }`
        - Note --> il dispositivo da cui provengono l'irrigazione o la misurazione deve essere posseduto da un utente
        - Autenticazione --> ✔️
        - Protocollo --> http

    - **_DELETE_ /notifications**:
        - Autore --> user
        - Query --> `? deviceId`
        - Output --> `null`
        - Note --> il dispositivo deve essere posseduto dall'utente
        - Autenticazione --> ✔️
        - Protocollo --> http

- **UserSettings**
    - **_GET_ /me/user-settings**:
        - Autore --> user
        - Output --> `{ id, userId, styleMode, units, updatedAt, createdAt }`
        - Note --> le impostazioni restituite sono quelle dell'utente autenticato
        - Autenticazione --> ✔️
        - Protocollo --> http

    - **_PATCH_ /me/user-settings**:
        - Autore --> user
        - Body --> `{ styleMode?, units? }`
        - Output --> `{ id, userId, styleMode, units, updatedAt, createdAt }`
        - Note --> le impostazioni modificate sono quelle dell'utente autenticato
        - Autenticazione --> ✔️
        - Protocollo --> http

- **DeviceSettings**
    - **_GET_ /devices-settings/:deviceId**:
        - Autore --> user
        - Params --> `:deviceId`
        - Output --> `{ id, deviceId, mode, humIMax, humIMin, kInterval, updatedAt, createdAt }`
        - Note --> l'utente deve possedere il dispositivo
        - Autenticazione --> ✔️
        - Protocollo --> http

    - **_GET_ /me/device-settings**:
        - Autore --> device
        - Output --> `{ id, deviceId, mode, humIMax, humIMin, kInterval, updatedAt, createdAt }`
        - Note --> le impostazioni restituite sono quelle del dispositivo autenticato
        - Autenticazione --> ✔️
        - Protocollo --> http

    - **_PATCH_ /devices-settings/:deviceId**:
        - Autore --> user
        - Params --> `:deviceId`
        - Body --> `{ mode?, humIMax?, humIMin?, kInterval? }`
        - Output --> `{ id, deviceId, mode, humIMax, humIMin, kInterval, updatedAt, createdAt }`
        - Note --> l'utente deve possedere il dispositivo
        - Autenticazione --> ✔️
        - Protocollo --> http

    - **OUTPUT v2/mode**:
        - Ricevente --> device
        - Body --> `{ event, mode, info }`
        - Note --> inviato a seguito di una modifica delle impostazioni del dispositivo (solo se attivo in quel momento)
        - Autenticazione --> ✔️
        - Protocollo --> ws

- **Authentication**
    - **_POST_ /user-login**:
        - Autore --> user
        - Body --> `{ email, psw }`
        - Output --> `{ accessToken, { id, email, updatedAt, createdAt } }`
        - Autenticazione --> ❌
        - Protocollo --> http

    - **_POST_ /device-login**:
        - Autore --> device
        - Body --> `{ key, psw }`
        - Output --> `{ accessToken, { id, userId, name, prototypeModel, activatedAt, updatedAt, createdAt } }`
        - Autenticazione --> ❌
        - Protocollo --> http

    - **_POST_ /user-register**:
        - Autore --> user
        - Body --> `{ email, psw }`
        - Output --> `{ id, email, updatedAt, createdAt }`
        - Note --> l'email non è valida se è già utilizzata
        - Autenticazione --> ❌
        - Protocollo --> http

    - **_POST_ /refresh**:
        - Autore --> device / user
        - Output --> `{ accessToken, { id, email, updatedAt, createdAt } }` | `{ accessToken, { id, userId, name, prototypeModel, activatedAt, updatedAt, createdAt } }`
        - Note --> viene effettuato il refresh del token del soggetto autenticato
        - Autenticazione --> ✔️
        - Protocollo --> http

    - **_POST /logout_**:
        - Autore --> device / user
        - Output --> `null`
        - Note --> viene effettuato il logout del soggetto autenticato, non da' errore se nessun soggetto è autenticato
        - Autenticazione --> ✔️/❌
        - Protocollo --> http

## Errori

- 400 — richiesta non valida
- 401 — non autenticato
- 403 — non autorizzato
- 404 — non trovato
- 409 — conflitto
- 500 — errore interno
