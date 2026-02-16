// Importazione moduli
import type { IrrigationsType } from '../models/Irrigations.model.js';

// Funzione calcolo umidità
function algorithmHumX(raw: IrrigationsType[], dataIndex: 0 | 1): number {
    // Filtrazione dati
    const dataDB: { humI: [number, number] }[] = raw
        .filter((data) => data.humIAfter > data.humIBefore)
        .map((data) => {
            return {
                humI: [data.humIBefore, data.humIAfter],
            };
        });

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
        return { data, weight: posC - Math.abs(posC - index) + 1 };
    });

    // Dichiarazione media e peso massimo
    let media = 0;
    let weightMax = 0;

    // Calcolo media e peso massimo
    dataSet.forEach((data) => {
        media += data.data * data.weight;
        weightMax += data.weight;
    });
    media = media / weightMax;

    return media;
}

// Funzione calcolo intervallo
function algorithmInterval(raw: IrrigationsType[]): number {
    // Filtrazione dati
    const dataDB: { humI: [number, number]; interval: number }[] = raw
        .filter(
            (data) => data.humIAfter > data.humIBefore && !isNaN(data.interval),
        )
        .map((data) => {
            return {
                humI: [data.humIBefore, data.humIAfter],
                interval: data.interval,
            };
        });

    // Controllo dati
    if (!dataDB || dataDB?.length < 10)
        throw new Error('Irrigations data are less than 10');

    // Dichiarazione media
    let mediaInt = 0;
    let mediaHum = 0;

    // Calcolo medie
    dataDB.forEach((data) => {
        mediaInt += data.interval;
        mediaHum += data.humI[1] - data.humI[0];
    });

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
export { algorithmInterval, algorithmHumX, algorithmUpdateKInterval };
