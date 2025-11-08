// Funzione calcolo humMin, humMax e interval
async function irrigationAlgorithm(DataModel: any, resHandler: any, res: any) {
    // Calcolo humMin

    // Ricavo dati database
    const dataDB = await DataModel.find({ type: 'irrigation_config' });

    // Controllo dati
    if (!dataDB || dataDB?.length < 10)
        return resHandler(
            res,
            404,
            null,
            'I dati delle irrigazioni sono mancanti o minori di 10!',
            false
        );

    // Sort dei dati per humI1
    const sortedData1 = dataDB
        .sort((a: any, b: any) => {
            return Array.isArray(a.humI) && Array.isArray(b.humI)
                ? a.humI[0] - b.humI[0]
                : 0;
        })
        .map((data: any) => (Array.isArray(data.humI) ? data.humI[0] : null));

    // Dichiarazione lista dati per humI1
    const data1: ({ humI: number; peso: number } | undefined)[] = [];

    // Dichiarazione posizione centrale per humI1
    const posC1: number | [number, number] =
        sortedData1.length % 2 == 0
            ? [sortedData1.length / 2 + 0.5, sortedData1.length / 2 - 0.5]
            : sortedData1.length / 2;

    // Dichiarazione media
    let media1 = 0;

    sortedData1.forEach((data: any): any => {
        // Dichiarazione peso
        let peso: number;

        // Controllo dato
        if (data) {
            // Controllo posC1
            if (Array.isArray(posC1)) {
                // Calcolo pesi
                const pesoM1 =
                    sortedData1.length / 2 +
                    Math.abs(posC1[1] - sortedData1.indexOf(data));
                const pesoM2 =
                    sortedData1.length / 2 +
                    Math.abs(posC1[0] - sortedData1.indexOf(data));

                // Assegnazione peso
                peso = pesoM1 < pesoM2 ? pesoM1 : pesoM2;
            } else if (!isNaN(posC1)) {
                // Assegnazione peso
                peso =
                    sortedData1.length / 2 +
                    0.5 +
                    Math.abs(posC1 - sortedData1.indexOf(data));
            } else {
                return resHandler(
                    res,
                    500,
                    null,
                    "Errore nel calcolo dei pesi per l'algoritmo di humMax e humMin!",
                    false
                );
            }

            data1.push({
                humI: data,
                peso,
            });
        }
    });

    // Calcolo media
    data1.forEach((data) => {
        // Somma alla media
        media1 += data ? data.humI * data.peso : 0;
    });

    // Calcolo humMin
    const humMin =
        sortedData1.length % 2 == 0
            ? media1 / ((sortedData1.length / 2) * (sortedData1.length / 2 + 1))
            : (media1 / (data1.length / 2)) ** 2;

    // Calcolo HumMax

    // Sort dei dati per humI2
    const sortedData2 = dataDB
        .sort((a: any, b: any) => {
            return Array.isArray(a.humI) && Array.isArray(b.humI)
                ? a.humI[1] - b.humI[1]
                : 0;
        })
        .map((data: any) => (Array.isArray(data.humI) ? data.humI[1] : null));

    // Dichiarazione lista dati per humI2
    const data2: ({ humI: number; peso: number } | undefined)[] = [];

    // Dichiarazione posizione centrale per humI2
    const posC2: number | [number, number] =
        sortedData2.length % 2 == 0
            ? [sortedData2.length / 2 + 0.5, sortedData2.length / 2 - 0.5]
            : sortedData2.length / 2;

    // Dichiarazione media
    let media2 = 0;

    sortedData2.forEach((data: any): any => {
        // Dichiarazione peso
        let peso: number;

        // Controllo dato
        if (data) {
            // Controllo posC2
            if (Array.isArray(posC2)) {
                // Calcolo pesi
                const pesoM1 =
                    sortedData2.length / 2 +
                    Math.abs(posC2[1] - sortedData2.indexOf(data));
                const pesoM2 =
                    sortedData2.length / 2 +
                    Math.abs(posC2[0] - sortedData2.indexOf(data));

                // Assegnazione peso
                peso = pesoM1 < pesoM2 ? pesoM1 : pesoM2;
            } else if (!isNaN(posC2)) {
                // Assegnazione peso
                peso =
                    sortedData2.length / 2 +
                    0.5 +
                    Math.abs(posC2 - sortedData2.indexOf(data));
            } else {
                return resHandler(
                    res,
                    500,
                    null,
                    "Errore nel calcolo dei pesi per l'algoritmo di humMax e humMin!",
                    false
                );
            }

            data2.push({
                humI: data,
                peso,
            });
        }
    });

    // Calcolo media
    data2.forEach((data) => {
        // Somma alla media
        media2 += data ? data.humI * data.peso : 0;
    });

    // Calcolo humMax
    const humMax =
        sortedData2.length % 2 == 0
            ? media2 / ((sortedData2.length / 2) * (sortedData2.length / 2 + 1))
            : (media2 / (data2.length / 2)) ** 2;

    // Calcolo Interval

    // Dichiarazione medie
    let mediaInt1 = 0;
    let mediaInt2 = 0;
    let valsInt1 = 0;
    let valsInt2 = 0;

    // Calcolo medie
    dataDB.forEach((data: any) => {
        // Controllo interval
        if (data.interval) {
            // Somma alla media 1
            mediaInt1 += data.interval;
            // Somma valori 1
            valsInt1 += 1;
        }
        // Controllo humI
        if (Array.isArray(data.humI)) {
            // Somma alla media 2
            mediaInt2 += data.humI[1] - data.humI[0];
            // Somma valori 2
            valsInt2 += 1;
        }
    });

    mediaInt1 = mediaInt1 / valsInt1;
    mediaInt2 = mediaInt2 / valsInt2;
    const interval = mediaInt1 / mediaInt2;

    // Ritorno valori
    return {
        humMin,
        humMax,
        interval,
    };
}

// Esportazione funzione
export default irrigationAlgorithm;
