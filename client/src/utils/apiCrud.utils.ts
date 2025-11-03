// Importazione moduli
import axios from 'axios';

// Funzione ricevere dati
async function getData(
    setValue: React.Dispatch<React.SetStateAction<any>>,
    accessToken: string,
    link: string,
    queries?: string,
    single = false
) {
    // Gestione errori
    try {
        // Richiesta
        const res = await axios.get(
            `${import.meta.env.VITE_API_URL}/api/${link}?authType=user${
                queries ? `&${queries}` : ''
            }`,
            { headers: { Authorization: `Bearer ${accessToken}` } }
        );

        // Controllo dati
        if (!res.data || !res.data?.success)
            throw new Error(res.data?.message || 'Errore nella richiesta!');

        // Controllo lunghezza data
        if (
            single &&
            Array.isArray(res.data.data) &&
            res.data.data.length > 0
        ) {
            // Impostazione valore
            setValue(res.data.data[0]);
        } else {
            // Impostazione valore
            setValue(res.data.data);
        }
    } catch (error: unknown) {
        let errorMsg = 'Errore sconosciuto!';

        if (axios.isAxiosError(error)) {
            // Caso 1: risposta dal server con campo "message"
            errorMsg =
                (error as any).response?.data?.message ||
                (error as any).message;
        } else if (error instanceof Error) {
            // Caso 2: altri errori generici
            errorMsg = error.message;
        }

        // Impostazione errore
        throw new Error(errorMsg);
    }
}

// Funzione creazione dati
async function patchData(accessToken: string, link: string, body?: any) {
    // Gestione errori
    try {
        // Richiesta
        const res = await axios.patch(
            `${import.meta.env.VITE_API_URL}/api/${link}?authType=user`,
            body,
            { headers: { Authorization: `Bearer ${accessToken}` } }
        );

        // Controllo dati
        if (!res.data || !res.data?.success)
            throw new Error(res.data?.message || 'Errore nella richiesta!');

        // Ritorno valori
        return res.data.data;
    } catch (error: unknown) {
        let errorMsg = 'Errore sconosciuto!';

        if (axios.isAxiosError(error)) {
            // Caso 1: risposta dal server con campo "message"
            errorMsg =
                (error as any).response?.data?.message ||
                (error as any).message;
        } else if (error instanceof Error) {
            // Caso 2: altri errori generici
            errorMsg = error.message;
        }

        // Impostazione errore
        throw new Error(errorMsg);
    }
}

// Esportazione funzione
export { getData, patchData };
