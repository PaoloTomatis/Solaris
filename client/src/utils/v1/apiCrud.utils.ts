// Importazione moduli
import axios from 'axios';
import type { APIResponse } from './type.utils';

// Funzione ricevere dati
async function getData<T>(
    setValue: React.Dispatch<React.SetStateAction<any>>,
    accessToken: string,
    link: string,
    queries?: string,
    single = false,
) {
    // Tipo output
    interface FullAPIResponse extends APIResponse {
        data: T;
    }

    // Gestione errori
    try {
        // Richiesta
        const res = await axios.get<FullAPIResponse>(
            `${import.meta.env.VITE_API_V1_URL}/${link}?authType=user${
                queries ? `&${queries}` : ''
            }`,
            { headers: { Authorization: `Bearer ${accessToken}` } },
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
async function patchData<T>(
    accessToken: string,
    link: string,
    body?: any,
    params?: string,
) {
    // Tipo output
    interface FullAPIResponse extends APIResponse {
        data: T;
    }

    // Gestione errori
    try {
        // Richiesta
        const res = await axios.patch<FullAPIResponse>(
            `${import.meta.env.VITE_API_V1_URL}/${link}${
                params ? `/${params}` : ''
            }?authType=user`,
            body,
            { headers: { Authorization: `Bearer ${accessToken}` } },
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

// Funzione eliminazione dati
async function deleteData<T>(
    accessToken: string,
    link: string,
    queries?: string,
) {
    // Gestione errori
    try {
        // Tipo output
        interface FullAPIResponse extends APIResponse {
            data: T;
        }

        // Richiesta
        const res = await axios.delete<FullAPIResponse>(
            `${import.meta.env.VITE_API_V1_URL}/${link}?authType=user${
                queries ? `&${queries}` : ''
            }`,
            { headers: { Authorization: `Bearer ${accessToken}` } },
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
export { getData, patchData, deleteData };
