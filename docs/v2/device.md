# Hardware & Device Support — SOLARIS VEGA

## Regole di base

- Categoria dispositivo: IOT
- Versione hardware: v1
- Protocollo comunicazione: HTTP / WebSocket / Serial
- Alimentazione: Batteria / Rete elettrica
- Modalità operativa: Online / Offline
- Aggiornamenti firmware OTA: ❌
- Ambiente operativo: Indoor / Outdoor

## Specifiche Hardware

- **Microcontrollore**
    - Modello --> ESP32
    - Frequenza --> 200MHz
    - Memoria Flash --> 4MB

- **Breadboard**
    - Tipo --> supporto

- **DHT22**
    - Tipo --> temperatura e umidità
    - Range operativo (temperatura) --> `-40°C / 80°C`
    - Precisione (temperatura) --> `0.5°C`
    - Range operativo (umidità) --> `0% / 100% RH`
    - Precisione (umidità) --> `2% RH`
    - Interfaccia --> Digital
    - Tensione operativa --> `3.3v`

- **Sensore Umidità Suolo Capacitivo**
    - Tipo --> umidità
    - Interfaccia --> Analog
    - Tensione operativa --> `3.3v`

- **Fotoresistenza**
    - Tipo --> luminosità
    - Interfaccia --> Analog
    - Tensione operativa --> `3.3v`

- **Resistenze**
    - Tipo --> supporto

- **Pompa**
    - Tipo --> pompa
    - Controllo --> Digital
    - Tensione operativa --> `5v`

- **RGB Led**
    - Tipo --> supporto
    - Tensione operativa --> `3.3v`

- **Power Supply**
    - Tipo --> supporto

- **Mosfet**
    - Tipo --> supporto

- **Diodo**
    - Tipo --> supporto

- **Jumper Wires**
    - Tipo --> supporto

- **Connettività**
    - Wi-Fi --> ✔️
    - Bluetooth --> ❌
    - Ethernet --> ❌
    - Protocollo dati --> JSON

- **Alimentazione**
    - Tipo --> Batteria / Cavo
    - Voltaggio operativo --> `9v` (ridotto a `5v` dal power supply)
    - Modalità risparmio energetico --> ❌

## Firmware

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

- **Measurementloop - Config**
    - Device --> attesa 60s
    - Device --> misurazioni con sensori
    - Device --> controllo temperatura sicura (2°C - 30°C)
    - Device --> controllo umidità sicura (30% - 85%)
    - Device --> invio misurazioni al server
    - Server --> salvataggio misurazioni nel database
    - Server --> invio misurazioni al client via WS

- **Measurementloop - Auto**
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

- **Measurementloop - Safe**
    - Device --> attesa 60s
    - Device --> misurazioni con sensori
    - Device --> controllo temperatura sicura (2°C - 30°C)
    - Device --> controllo umidità sicura (30% - 85%)

- **Mainloop**
    - Device --> invio stato al server via WS
    - Server --> invio stato al client via WS
    - Device --> attesa eventi WS

## Sicurezza

- Autenticazione dispositivo --> JWT
- Criptografia comunicazioni --> in fase di implementazione
- Protezione accesso fisico --> in fase di implementazione
- Validazione firmware --> in fase di implementazione

## Supporto e Manutenzione

- Diagnostica remota --> ❌
- Log dispositivo --> ✔️
- Reset hardware --> pulsante
- Calibrazione sensori --> in fase di implementazione
- Intervalli manutenzione --> in fase di implementazione
