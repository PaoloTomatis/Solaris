# Irrigation Algorithm — SOLARIS

## HumIMax - HumIMin

1. Calcolo mediana tra i dati \
   _**es.** 25 25 27 **28 29** 29 35 35_
2. Assegnazione peso \
   _**Formula** --> p = nDati / 2 - pos (se nDati è pari) | p = nDati / 2 + 0.5 - pos (se nDati è dispari)_ \
   _**es**. 29 --> p = 8 / 2 - 1 = 3_
3. Calcolo media ponderata \
   _**Formula** --> pTot = pMax \* (pMax + 1) (se nDati è pari) | pTot = pMax^2 (se nDati è dispari)_ \
   _**es**. humMin = ( 25 * 1 + 25 * 2 + 27 \* 3 + ...) / 20_

## kInterval

1. Calcolo media aritmetica tra gli intervalli \
    _**es.** intervals = (120 + 135 + 115 + 120 + 120) / 5 = 120s_
2. Calcolo media aritmetica tra le variazioni di umidità \
    _**es**. Δhum = ((75 + 80 + 70) - (20 + 25 + 35)) / 3 = 48.3%_
3. Calcolo coefficiente d'intervallo \
   _**Formula** --> kInterval = intervals / Δhum_ \
    _**es**. kInterval = 122 / 48.3 = 2.5258_

## kInterval (auto-correzione)

1. Calcolo errore relativo \
    _**Formula** --> error = (humMax - humI2) / (humMax - humI1)_ \
    _**es.** error = (70 - 67) / (70 - 30) = 0.075_
2. Calcolo nuovo coefficiente d'intervallo \
    _**Formula** --> kIntervalNew = kInterval + (kInterval * error * 0.05)_ \
    _**es.** kIntervalNew = 2.5258 + (2.5258 * 0.075 * 0.05) = 2.5353_
3. Calcolo coefficiente d'intervallo massimo e minimo \
    _**Formula** --> kIntervalMax = kInterval * 110/100 | kIntervalMin = kInterval * 90/100_ \
    _**es.** kIntervalMax = 2.5258 * 110/100 = 2.7784 | kIntervalMin = 2.5258 * 90/100 = 2.2732_
4. Controllo coefficiente d'intervallo nuovo \
    _**Formula** --> kIntervalMin < kIntervalNew < kIntervalMax_ \
    _**es.** 2.2732 < 2.5353 < 2.7784_
