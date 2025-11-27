// Importazione moduli
import type { DataType } from '../models/Data.model.js';

// Funzione calcolo umidità
function algorithmHumX(
    raw: DataType[],
    dataIndex: 0 | 1
): number | { error: { status: number; message: string } } {
    // Filtrazione dati
    const dataDB = raw.filter(
        (data) =>
            Array.isArray(data.humI) &&
            data.humI.length == 2 &&
            data.humI[1] > data.humI[0]
    ) as { humI: [number, number]; interval: any }[];

    // Controllo dati
    if (!dataDB || dataDB?.length < 10)
        return {
            error: {
                status: 404,
                message:
                    'I dati delle irrigazioni sono mancanti o minori di 10!',
            },
        };

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
function algorithmInterval(
    raw: DataType[]
): number | { error: { status: number; message: string } } {
    // Filtrazione dati
    const dataDB = raw.filter(
        (data) =>
            Array.isArray(data.humI) &&
            data.humI.length == 2 &&
            !isNaN(data.interval) &&
            typeof data.interval == 'number'
    ) as { humI: [number, number]; interval: number }[];

    // Controllo dati
    if (!dataDB || dataDB?.length < 10)
        return {
            error: {
                status: 404,
                message:
                    'I dati delle irrigazioni sono mancanti o minori di 10!',
            },
        };

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
function algorithmUpdateInterval(
    humI1: number,
    humI2: number,
    humMax: number,
    interval: number
): number | { error: { status: number; message: string } } {
    // Calcolo errore relativo
    const error = (humMax - humI2) / (humMax - humI1);

    // Calcolo nuovo interval
    const newInterval = interval + interval * error * 0.05;

    // Calcolo interval massimo e minimo
    const intervalMax = (interval * 110) / 100;
    const intervalMin = (interval * 90) / 100;

    // Controllo nuovo interval
    if (newInterval > intervalMax || newInterval < intervalMin)
        return {
            error: {
                status: 400,
                message: "Il dato dell'irrigazione è errato!",
            },
        };

    return newInterval;
}

// Esportazione funzioni
export { algorithmInterval, algorithmHumX, algorithmUpdateInterval };
