// Importazione moduli
import axios from 'axios';
import type { APIResponseSuccess, APIResponseError } from './type.utils';

// Funzione controllo successo richiesta
function isSuccess<T>(
    res: APIResponseSuccess<T> | APIResponseError,
): res is APIResponseSuccess<T> {
    return (res as APIResponseSuccess<T>).data !== undefined;
}

// Funzione ricevere dati
async function getData<T>(
    setValue: React.Dispatch<React.SetStateAction<any>>,
    accessToken: string,
    link: string,
    queries?: string,
    single = false,
) {
    // Gestione errori
    try {
        // Richiesta
        const res = await axios.get<APIResponseSuccess<T> | APIResponseError>(
            `${import.meta.env.VITE_API_URL}/${link}?authType=user${
                queries ? `&${queries}` : ''
            }`,
            { headers: { Authorization: `Bearer ${accessToken}` } },
        );

        // Dichiarazione dati api
        const apiData = res.data;

        // Controllo dati
        if (!isSuccess(apiData))
            throw new Error(apiData.message || 'Errore nella richiesta!');

        // Controllo lunghezza data
        if (single && Array.isArray(apiData.data) && apiData.data.length > 0) {
            // Impostazione valore
            setValue(apiData.data[0]);
        } else {
            // Impostazione valore
            setValue(apiData.data);
        }
    } catch (error: unknown) {
        let errorMsg = 'Errore sconosciuto!';

        if (axios.isAxiosError(error)) {
            // Errore axios
            errorMsg =
                (error as any).response?.data?.message ||
                (error as any).message;
        } else if (error instanceof Error) {
            // Errore richiesta
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
    // Gestione errori
    try {
        // Richiesta
        const res = await axios.patch<APIResponseSuccess<T> | APIResponseError>(
            `${import.meta.env.VITE_API_URL}/${link}${
                params ? `/${params}` : ''
            }?authType=user`,
            body,
            { headers: { Authorization: `Bearer ${accessToken}` } },
        );

        // Dichiarazione dati api
        const apiData = res.data;

        // Controllo dati
        if (!isSuccess(apiData))
            throw new Error(apiData.message || 'Errore nella richiesta!');

        // Ritorno valori
        return apiData.data;
    } catch (error: unknown) {
        let errorMsg = 'Errore sconosciuto!';

        if (axios.isAxiosError(error)) {
            // Errore axios
            errorMsg =
                (error as any).response?.data?.message ||
                (error as any).message;
        } else if (error instanceof Error) {
            // Errore richiesta
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
        // Richiesta
        const res = await axios.delete<
            APIResponseSuccess<T> | APIResponseError
        >(
            `${import.meta.env.VITE_API_URL}/${link}?authType=user${
                queries ? `&${queries}` : ''
            }`,
            { headers: { Authorization: `Bearer ${accessToken}` } },
        );

        // Dichiarazione dati api
        const apiData = res.data;

        // Controllo dati
        if (!isSuccess(apiData))
            throw new Error(apiData.message || 'Errore nella richiesta!');

        // Ritorno valori
        return apiData.data;
    } catch (error: unknown) {
        let errorMsg = 'Errore sconosciuto!';

        if (axios.isAxiosError(error)) {
            // Errore axios
            errorMsg =
                (error as any).response?.data?.message ||
                (error as any).message;
        } else if (error instanceof Error) {
            // Errore richiesta
            errorMsg = error.message;
        }

        // Impostazione errore
        throw new Error(errorMsg);
    }
}

// Esportazione funzione
export { getData, patchData, deleteData };
