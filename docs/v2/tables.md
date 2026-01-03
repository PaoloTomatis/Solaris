# Database — SOLARIS

## Tabelle

### Users

**Campi principali:**

-   `id` — string PK — identificativo univoco
-   `email` — string — email
-   `psw` — string — hash password
-   `role` — "admin" | "user" — hash password
-   `schemaVersion` — 1 | 2 | ... — versione schema
-   `updatedAt` — date — data modifica elemento
-   `createdAt` — date — data creazione elemento

**Vincoli/Regole:**

-   `email` — deve rispettare la sintassi di un'email (username@domin.io)
-   `psw` — deve rispettare la sintassi di una password (>8 caratteri, caratteri speciali, numeri, lettere maiuscole/minuscole)

### Devices

**Campi principali:**

-   `id` — string PK — identificativo univoco
-   `userId` — string? FK — collegamento a utente
-   `key` — string — modello
-   `name` — string — nome
-   `psw` — string — hash password
-   `prototypeModel` — "Solaris Vega" — modello
-   `schemaVersion` — 1 | 2 | ... — versione schema
-   `activatedAt` — date — data attivazione
-   `updatedAt` — date — data modifica elemento
-   `createdAt` — date — data creazione elemento

**Vincoli/Regole:**

-   `userId` — non presente se il dispositivo non è attivato
-   `key` — deve rispettare la sintassi di un uuid (>8 caratteri, numeri, lettere maiuscole/minuscole)
-   `name` — <20 caratteri, no caratteri speciali
-   `psw` — deve rispettare la sintassi di una password (>8 caratteri, caratteri speciali, numeri, lettere maiuscole/minuscole)

### Irrigations

**Campi principali:**

-   `id` — string PK — identificativo univoco
-   `deviceId` — string FK — collegamento a dispositivo
-   `temp` — float — temperatura
-   `lum` — float — luminosità
-   `humE` — float — umidità esterna
-   `humIBefore` — float — umidità suolo prima dell'irrigazione
-   `humIAfter` — float — umidità suolo dopo l'irrigazione
-   `interval` — integer — intervallo
-   `type` — "auto" | "config" — tipo
-   `schemaVersion` — 1 | 2 | ... — versione schema
-   `irrigatedAt` — date — data irrigazione
-   `updatedAt` — date — data modifica elemento
-   `createdAt` — date — data creazione elemento

**Vincoli/Regole:**

-   `temp` — decimale, >-50, <100
-   `lum` — positivo, decimale, <100
-   `humE` — positivo, decimale, <100
-   `humIBefore` — positivo, decimale, <100
-   `humIAfter` — positivo, decimale, <100
-   `interval` — positivo, intero

### Measurement

**Campi principali:**

-   `id` — string PK — identificativo univoco
-   `deviceId` — string FK — collegamento a dispositivo
-   `temp` — float — temperatura
-   `lum` — float — luminosità
-   `humE` — float — umidità esterna
-   `humI` — float — umidità suolo
-   `schemaVersion` — 1 | 2 | ... — versione schema
-   `measuredAt` — date — data misurazione
-   `updatedAt` — date — data modifica elemento
-   `createdAt` — date — data creazione elemento

**Vincoli/Regole:**

-   `temp` — decimale, >-50, <100
-   `lum` — positivo, decimale, <100
-   `humE` — positivo, decimale, <100
-   `humI` — positivo, decimale, <100

### Notifications

**Campi principali:**

-   `id` — string PK — identificativo univoco
-   `userId` — string FK — collegamento a utente
-   `deviceId` — string? FK — collegamento a dispositivo
-   `irrigationId` — string? FK — collegamento a irrigazione
-   `measurementId` — string? FK — collegamento a misurazione
-   `title` — string — titolo
-   `description` — string — descrizione
-   `type` — "error" | "warning" | "info" | "success" — tipo
-   `schemaVersion` — 1 | 2 | ... — versione schema
-   `updatedAt` — date — data modifica elemento
-   `createdAt` — date — data creazione elemento

**Vincoli/Regole:**

-   `deviceId` — non è necessario, utilizzato solo se si vuole collegare un log ad un dispositivo, se non è presente non ci possono essere nè irrigationId nè measurementId
-   `irrigationId` — non è necessario, utilizzato solo se si vuole collegare un log ad una irrigazione, se presente insieme al deviceId l'irrigazione deve possedere la stessa proprietà, non può essere presente se c'è measurementId
-   `measurementId` — non è necessario, utilizzato solo se si vuole collegare un log ad una misurazione, se presente insieme al deviceId la misurazione deve possedere la stessa proprietà, non può essere presente se c'è irrigationId
-   `title` — >3 caratteri, <50 caratteri
-   `description` — >3 caratteri, <200 caratteri

### UserSettings

**Campi principali:**

-   `id` — string PK — identificativo univoco
-   `userId` — string FK — collegamento a utente
-   `styleMode` — "dark" | "light" — stile grafico
-   `units` — "imperial" | "metric" — unità di misura
-   `schemaVersion` — 1 | 2 | ... — versione schema
-   `updatedAt` — date — data modifica elemento
-   `createdAt` — date — data creazione elemento

### DeviceSettings

**Campi principali:**

-   `id` — string PK — identificativo univoco
-   `deviceId` — string FK — collegamento a dispositivo
-   `mode` — "config" | "auto" | "safe" — stile grafico
-   `humIMax` — float? — umidità del suolo massima
-   `humIMin` — float? — umidità del suolo minima
-   `kInterval` — float? — coefficiente di intervallo
-   `schemaVersion` — 1 | 2 | ... — versione schema
-   `updatedAt` — date — data modifica elemento
-   `createdAt` — date — data creazione elemento

**Vincoli/Regole:**

-   `humIMax` — positivo, decimale, <100, >humIMin, non presente se mode è diverso da "auto"
-   `humIMax` — positivo, decimale, <100, <humIMax, non presente se mode è diverso da "auto"
-   `kInterval` — positivo, decimale, non presente se mode è diverso da "auto"

### Sessions

**Campi principali:**

-   `id` — string PK — identificativo univoco
-   `userId` — string? FK — collegamento a utente
-   `deviceId` — string? FK — collegamento a dispositivo
-   `refreshToken` — string — token
-   `ipAddress` — string — indirizzo ip
-   `userAgent` — string — browser e sistema operativo
-   `subject` — "user" | "device" — soggetto
-   `status` — "active" | "expired" | "revoked" — stato
-   `schemaVersion` — 1 | 2 | ... — versione schema
-   `updatedAt` — date — data modifica elemento
-   `createdAt` — date — data creazione elemento
