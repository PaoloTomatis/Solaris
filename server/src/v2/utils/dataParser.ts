// Firma con id
function dataParser<T extends object, K extends keyof T>(
    data: T,
    removedFields: K[],
    convertId: true
): Omit<T, K | '_id'> & { id: string };

// Firma senza id
function dataParser<T extends object, K extends keyof T>(
    data: T,
    removedFields: K[],
    convertId?: false
): Omit<T, K>;

// Funzione conversione dati
function dataParser<T extends object, K extends keyof T>(
    data: T,
    removedFields: K[],
    convertId?: boolean
) {
    // Dichiarazione dati convertiti
    const parsedData = { ...data } as any;

    // Controllo conversione id
    if (convertId && parsedData['_id']) {
        parsedData['id'] = parsedData['_id'].toString();
        delete parsedData['_id'];
    }

    // Eliminazione dati
    removedFields.forEach((key) => {
        delete parsedData[key];
    });

    // Ritorno
    return parsedData;
}

// Esportazione funzione
export default dataParser;
