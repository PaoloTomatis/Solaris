// Funzione conversione dati
function dataParser<T extends object, K extends keyof T>(
    data: T,
    removedFields: K[]
) {
    // Dichiarazione dati convertiti
    const parsedData = { ...data };

    // Eliminazione dati
    removedFields.forEach((key) => {
        delete parsedData[key];
    });

    return parsedData as Omit<T, K>;
}

// Esportazione funzione
export default dataParser;
