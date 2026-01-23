// Importazione moduli
import axios from 'axios';
import type { APIResponseSuccess, APIResponseError } from './type.utils';

// Funzione controllo successo richiesta
function isSuccess<T>(
    res: APIResponseSuccess<T> | APIResponseError,
): res is APIResponseSuccess<T> {
    return (res as APIResponseSuccess<T>).data !== undefined;
}

// Firma funzione
async function getData<T>(
    accessToken: string,
    link: string,
    setValue?: null,
    queries?: string | null,
): Promise<T[] | null>;

// Firma funzione
async function getData<T>(
    accessToken: string,
    link: string,
    setValue: React.Dispatch<React.SetStateAction<any>>,
    queries?: string | null,
): Promise<void>;

// Funzione ricevere dati
async function getData<T>(
    accessToken: string,
    link: string,
    setValue?: React.Dispatch<React.SetStateAction<any>> | null,
    queries?: string | null,
): Promise<T[] | null | void> {
    // Gestione errori
    try {
        // Richiesta
        const res = await axios.get<APIResponseSuccess<T> | APIResponseError>(
            `${import.meta.env.VITE_API_V2_URL}/${link}?authType=user${
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
        if (!Array.isArray(apiData.data) || apiData.data.length <= 0)
            return null;

        // Controllo impostazione valore
        if (setValue) {
            // Impostazione valore
            setValue(apiData.data[0]);
        } else {
            // Ritorno valore
            return apiData.data[0];
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

// Firma funzione
async function getOneData<T>(
    accessToken: string,
    link: string,
    setValue?: null,
    queries?: string | null,
): Promise<T | null>;

// Firma funzione
async function getOneData<T>(
    accessToken: string,
    link: string,
    setValue: React.Dispatch<React.SetStateAction<any>>,
    queries?: string | null,
): Promise<void>;

// Funzione ricevere dato
async function getOneData<T>(
    accessToken: string,
    link: string,
    setValue?: React.Dispatch<React.SetStateAction<any>> | null,
    queries?: string | null,
): Promise<T | null | void> {
    // Gestione errori
    try {
        // Richiesta
        const res = await axios.get<APIResponseSuccess<T> | APIResponseError>(
            `${import.meta.env.VITE_API_V2_URL}/${link}?authType=user${
                queries ? `&${queries}` : ''
            }`,
            { headers: { Authorization: `Bearer ${accessToken}` } },
        );

        // Dichiarazione dati api
        const apiData = res.data;

        // Controllo dati
        if (!isSuccess(apiData))
            throw new Error(apiData.message || 'Errore nella richiesta!');

        // Controllo impostazione valore
        if (setValue) {
            // Impostazione valore
            setValue(apiData.data);
        } else {
            // Ritorno valore
            return apiData.data;
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
async function postData<T>(
    link: string,
    type: 'api' | 'auth',
    accessToken?: string | null,
    body?: any,
    params?: string,
) {
    // Gestione errori
    try {
        // Richiesta
        const res = await axios.post<APIResponseSuccess<T> | APIResponseError>(
            `${type == 'api' ? import.meta.env.VITE_API_V2_URL : import.meta.env.VITE_AUTH_V2_URL}/${link}${
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
            `${import.meta.env.VITE_API_V2_URL}/${link}${
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
            `${import.meta.env.VITE_API_V2_URL}/${link}?authType=user${
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
export { getData, getOneData, postData, patchData, deleteData };
