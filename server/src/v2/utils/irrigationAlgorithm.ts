// Importazione moduli
import type { IrrigationsType } from '../models/Irrigations.model.js';

// Funzione filtrazione dati umidità
function filterHumData(raw: IrrigationsType[]): { humI: [number, number] }[] {
    return raw
        .filter((data) => data.humIAfter > data.humIBefore)
        .map((data) => {
            return {
                humI: [data.humIBefore, data.humIAfter],
            };
        });
}

// Funzione calcolo peso
function calcWeight(posC: number, index: number) {
    return posC - Math.abs(posC - index) + 1;
}

// Funzione calcolo totale
function calcTot(dataSet: number[]) {
    // Definizione totale
    let tot = 0;

    // Iterazione dati
    dataSet.forEach((data) => (tot += data));

    return tot;
}

// Funzione filtrazione dati intervallo
function filterIntervalData(
    raw: IrrigationsType[],
): { humI: [number, number]; interval: number }[] {
    return raw
        .filter(
            (data) => data.humIAfter > data.humIBefore && !isNaN(data.interval),
        )
        .map((data) => {
            return {
                humI: [data.humIBefore, data.humIAfter],
                interval: data.interval,
            };
        });
}

// Funzione calcolo umidità
function algorithmHumX(raw: IrrigationsType[], dataIndex: 0 | 1): number {
    // Filtrazione dati
    const dataDB = filterHumData(raw);

    // Controllo dati
    if (!dataDB || dataDB?.length < 10)
        throw new Error('Irrigations data are less than 10');

    // Dichiarazione set dati
    let dataSet: number[] | { data: number; weight: number }[] = dataDB
        .map((data) => {
            return data.humI[dataIndex];
        })
        .sort((a, b) => a - b);

    // Dichiarazione centro
    const posC = (dataSet.length - 1) / 2;

    // Calcolo pesi
    dataSet = dataSet.map((data, index) => {
        return { data, weight: calcWeight(posC, index) };
    });

    // Calcolo media
    let media = calcTot(dataSet.map((data) => data.data));

    // Calcolo peso massimo
    let weightMax = calcTot(
        dataSet.map((data) => {
            return data.weight;
        }),
    );

    return media / weightMax;
}

// Funzione calcolo intervallo
function algorithmInterval(raw: IrrigationsType[]): number {
    // Filtrazione dati
    const dataDB = filterIntervalData(raw);

    // Controllo dati
    if (!dataDB || dataDB?.length < 10)
        throw new Error('Irrigations data are less than 10');

    // Dichiarazione media
    let mediaInt = calcTot(dataDB.map((data) => data.interval));
    let mediaHum = calcTot(dataDB.map((data) => data.humI[1] - data.humI[0]));

    return mediaInt / dataDB.length / (mediaHum / dataDB.length);
}

// Funzione aggiornamento intervallo
function algorithmUpdateKInterval(
    humIBefore: number,
    humIAfter: number,
    humIMax: number,
    kInterval: number,
): number {
    // Calcolo errore relativo
    const error = (humIMax - humIAfter) / (humIMax - humIBefore);

    // Calcolo nuovo interval
    const newInterval = kInterval + kInterval * error * 0.05;

    // Calcolo interval massimo e minimo
    const intervalMax = (kInterval * 110) / 100;
    const intervalMin = (kInterval * 90) / 100;

    // Controllo nuovo interval
    if (newInterval > intervalMax || newInterval < intervalMin)
        throw new Error('Irrigations data are wrong');

    return newInterval;
}

// Esportazione funzioni
export {
    algorithmInterval,
    algorithmHumX,
    algorithmUpdateKInterval,
    filterHumData,
    filterIntervalData,
    calcTot,
    calcWeight,
};
