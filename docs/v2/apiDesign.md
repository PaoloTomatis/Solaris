# API Design — SOLARIS

## Regole di base

-   Protocollo: HTTP
-   Formato: JSON
-   Autenticazione: JWT, l’identità del soggetto (user o device) viene sempre risolta dal token di accesso
-   Versione: v2
-   Output: `{ data: {...} }` (... specificata dal campo [Output]) | `{ message: string }`

## Risorse

-   **Users**

    -   **_GET_ /me**:

        -   Autore --> user
        -   Output --> `{ id, email, updatedAt, createdAt }`
        -   Note --> l'utente restituito è quello autenticato
        -   Autenticazione --> ✔️

    -   **_DELETE_ /me**:

        -   Autore --> user
        -   Output --> `null`
        -   Note --> l'utente eliminato è quello autenticato
        -   Autenticazione --> ✔️

-   **Devices**

    -   **_GET_ /devices/:id**:

        -   Autore --> user
        -   Params --> `/:id`
        -   Output --> `{ id, userId, name, prototypeModel, activatedAt, updatedAt, createdAt }`
        -   Note --> il dispositivo deve essere posseduto dall'utente
        -   Autenticazione --> ✔️

    -   **_POST_ /devices**:

        -   Autore --> user (admin)
        -   Body --> `{ key?, name?, psw?, prototypeModel }`
        -   Output --> `{ id, userId, name, prototypeModel, activatedAt, updatedAt, createdAt }`
        -   Note --> l'utente deve essere un amministratore
        -   Autenticazione --> ✔️

    -   **_PATCH_ /devices/:deviceId**:

        -   Autore --> user
        -   Params --> `/:id`
        -   Body --> `{ name? }`
        -   Output --> `{ id, userId, name, prototypeModel, activatedAt, updatedAt, createdAt }`
        -   Note --> il dispositivo deve essere posseduto dall'utente
        -   Autenticazione --> ✔️

    -   **_DELETE_ /devices/:deviceId**:
        -   Autore --> user (admin)
        -   Params --> `/:id`
        -   Output --> `null`
        -   Note --> l'utente deve essere un amministratore
        -   Autenticazione --> ✔️

-   **Irrigations**

    -   **_GET_ /irrigations**:

        -   Autore --> user
        -   Query --> `?deviceId & from & to & limit & sort & type`
        -   Output --> `{ id, deviceId, temp, lum, humE, humIBefore, humIAfter, interval, type, irrigatedAt, updatedAt, createdAt }`
        -   Note --> il dispositivo deve essere posseduto dall'utente
        -   Autenticazione --> ✔️

    -   **_POST_ /irrigations/execute**:

        -   Autore --> user
        -   Body --> `{ interval }`
        -   Output --> `null`
        -   Note --> il dispositivo deve essere posseduto dall'utente e deve essere in modalità configurazione
        -   Autenticazione --> ✔️

    -   **_POST_ /irrigations**:

        -   Autore --> device
        -   Body --> `{ temp, lum, humE, humIBefore, humIAfter, interval, type, irrigatedAt }`
        -   Output --> `{ id, deviceId, temp, lum, humE, humIBefore, humIAfter, interval, type, irrigatedAt, updatedAt, createdAt }`
        -   Note --> il dispositivo deve essere posseduto da un utente
        -   Autenticazione --> ✔️

-   **Measurements**

    -   **_GET_ /measurements**:

        -   Autore --> user
        -   Query --> `?deviceId & from & to & limit & sort`
        -   Output --> `{ id, deviceId, temp, lum, humE, humI, measuredAt, updatedAt, createdAt }`
        -   Note --> il dispositivo deve essere posseduto dall'utente
        -   Autenticazione --> ✔️

    -   **_POST_ /measurements**:

        -   Autore --> device
        -   Body --> `{ temp, lum, humE, humI, measuredAt }`
        -   Output --> `{ id, deviceId, temp, lum, humE, humI, measuredAt, updatedAt, createdAt }`
        -   Note --> il dispositivo deve essere posseduto da un utente
        -   Autenticazione --> ✔️

-   **Notifications**

    -   **_GET_ /notifications**:

        -   Autore --> user
        -   Query --> `? from & to & limit & sort & type`
        -   Output --> `{ id, irrigationId, measurementId, title, description, type, updatedAt, createdAt }`
        -   Note --> la notifica deve essere posseduta dall'utente, il dispositivo da cui provengono l'irrigazione o la misurazione deve essere posseduto dall'utente
        -   Autenticazione --> ✔️

    -   **_POST_ /notifications**:

        -   Autore --> device / user (admin)
        -   Body --> `{ userId, irrigationId?, measurementId?, title, description, type }`
        -   Output --> `{ id, irrigationId, measurementId, title, description, type, updatedAt, createdAt }`
        -   Note --> l'utente deve essere un amministratore, il dispositivo da cui provengono l'irrigazione o la misurazione deve essere posseduto dall'utente, se non viene specificato uno userId allora deve essere un device ad avere effettuato la richiesta (si prende direttamente dai suoi dati)
        -   Autenticazione --> ✔️

-   **UserSettings**

    -   **_GET_ /me/user-settings**:

        -   Autore --> user
        -   Output --> `{ id, userId, styleMode, units, updatedAt, createdAt }`
        -   Note --> le impostazioni restituite sono quelle dell'utente autenticato
        -   Autenticazione --> ✔️

    -   **_PATCH_ /me/user-settings**:

        -   Autore --> user
        -   Body --> `{ styleMode?, units? }`
        -   Output --> `{ id, userId, styleMode, units, updatedAt, createdAt }`
        -   Note --> le impostazioni modificate sono quelle dell'utente autenticato
        -   Autenticazione --> ✔️

-   **DeviceSettings**

    -   **_GET_ /device-settings/:deviceId**:

        -   Autore --> user
        -   Params --> `:deviceId`
        -   Output --> `{ id, deviceId, mode, humIMax, humIMin, kInterval, updatedAt, createdAt }`
        -   Note --> l'utente deve possedere il dispositivo
        -   Autenticazione --> ✔️

    -   **_GET_ /me/device-settings**:

        -   Autore --> device
        -   Output --> `{ id, deviceId, mode, humIMax, humIMin, kInterval, updatedAt, createdAt }`
        -   Note --> le impostazioni restituite sono quelle del dispositivo autenticato
        -   Autenticazione --> ✔️

    -   **_PATCH_ /device-settings/:deviceId**:

        -   Autore --> user
        -   Params --> `:deviceId`
        -   Body --> `{ mode?, humIMax?, humIMin?, kInterval? }`
        -   Output --> `{ id, deviceId, mode, humIMax, humIMin, kInterval, updatedAt, createdAt }`
        -   Note --> l'utente deve possedere il dispositivo
        -   Autenticazione --> ✔️

-   **Authentication**

    -   **_POST_ /user-login**:

        -   Autore --> user
        -   Body --> `{ email, psw }`
        -   Output --> `{ accessToken, { id, email, updatedAt, createdAt } }`
        -   Autenticazione --> ❌

    -   **_POST_ /device-login**:

        -   Autore --> device
        -   Body --> `{ key, psw }`
        -   Output --> `{ accessToken, { id, userId, name, prototypeModel, activatedAt, updatedAt, createdAt } }`
        -   Autenticazione --> ❌

    -   **_POST_ /register**:

        -   Autore --> user
        -   Body --> `{ email, psw }`
        -   Output --> `{ id, email, updatedAt, createdAt }`
        -   Note --> l'email non è valida se è già utilizzata
        -   Autenticazione --> ❌

    -   **_POST_ /refresh**:

        -   Autore --> device / user
        -   Output --> `{ accessToken, { id, email, updatedAt, createdAt } }` | `{ accessToken, { id, userId, name, prototypeModel, activatedAt, updatedAt, createdAt } }`
        -   Note --> viene effettuato il refresh del token del soggetto autenticato
        -   Autenticazione --> ✔️

    -   **_POST /logout_**:

        -   Autore --> device / user
        -   Output --> `null`
        -   Note --> viene effettuato il logout del soggetto autenticato, non da' errore se nessun soggetto è autenticato
        -   Autenticazione --> ✔️/❌

## Errori

-   400 — richiesta non valida
-   401 — non autenticato
-   403 — non autorizzato
-   404 — non trovato
-   409 — conflitto
-   500 — errore interno
