// Importazione moduli
import axios from 'axios';

// Funzione ricevere dati
async function getData(
    setLoading: React.Dispatch<React.SetStateAction<boolean>>,
    setError: React.Dispatch<React.SetStateAction<string>>,
    setValue: React.Dispatch<React.SetStateAction<any>>,
    accessToken: string,
    link: string,
    queries?: string
) {
    // Gestione errori
    try {
        // Impostazione caricamento
        setLoading(true);
        // Richiesta logout
        const res = await axios.get(
            `${import.meta.env.VITE_API_URL}/api/${link}?authType=user${
                queries ? `&${queries}` : ''
            }`,
            { headers: { Authorization: `Bearer ${accessToken}` } }
        );

        // Controllo dati
        if (!res.data || !res.data?.success)
            throw new Error(res.data?.message || 'Errore nella richiesta!');

        // Impostazione valore
        setValue(null);
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
        setError(errorMsg);
    } finally {
        // Impostazione caricamento
        setLoading(false);
    }
}

// Esportazione funzione
export default getData;
