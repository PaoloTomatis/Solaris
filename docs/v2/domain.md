# Dominio — SOLARIS

## Obiettivo del Sistema

Solaris presenta dei dispositivi che possono essere controllati dagli utenti, quest'ultimi vogliono raccogliere informazioni dai device e controllarne il comportamento

## Attori

-   Device
-   User

## Casi d’uso principali

### UC1 — Inviare una misurazione

**Attore**: Device \
**Input**: Misurazione inviata dal device \
**Regole**:

-   il device deve essere collegato a un utente
-   il device deve essere in stato attivo

**Output**: La misurazione è validata

### UC2 — Inviare un'irrigazione

**Attore**: User \
**Input**: Comando irrigazione ad un device \
**Regole**:

-   l'utente deve possedere il device
-   il device deve essere in stato attivo e disponibile

**Output**: Device inizia l'irrigazione

### UC3 — Collegare Device

**Attore**: User \
**Input**: Richiesta di collegamento ad un device \
**Regole**:

-   il device non deve essere posseduto da nessuno
-   il device deve essere esistente

**Output**: Device viene collegato all'utente

### UC4 — Generazione Impostazioni

**Attore**: User \
**Input**: Richiesta di aggiornamento impostazioni automatiche \
**Regole**:

-   l'utente deve possedere il device
-   il device deve essere in stato attivo e disponibile
-   il device deve aver effettuato delle irrigazioni manuali

Output: Device possiede nuove impostazioni automatiche

### UC5 — Scollegamento Device

**Attore**: User \
**Input**: Richiesta di scollegamento da un device \
**Regole**:

-   l'utente deve possedere il device
-   il device deve essere in stato attivo

**Output**: Device viene scollegato dall'utente
