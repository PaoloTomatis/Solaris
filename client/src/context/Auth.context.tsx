// Importazione moduli
import {
    createContext,
    useContext,
    useState,
    type ReactNode,
    useEffect,
} from 'react';
import type { User as UserType } from '../utils/type.utils';
import axios from 'axios';

// Dichiarazione contesto autenticazione
const AuthContext = createContext({});

// Provider autenticazione
function AuthProvider({ children }: { children: ReactNode }) {
    // Stato utente
    const [user, setUser] = useState<UserType | null>(null);
    // Stato accessToken
    const [accessToken, setAccessToken] = useState<string | null>(null);

    // Caricamento componente
    useEffect(() => {
        //TODO Controllo validità token
        // Ricavazione token
        const token = localStorage.getItem('accessToken');
        // Controllo token
        if (token) {
            // Impostazione token
            setAccessToken(token);
        }
    }, []);

    // Caricamento componente
    useEffect(() => {
        //TODO Controllo validità token
        // Controllo token
        if (accessToken) {
            // Impostazione token
            localStorage.setItem('accessToken', accessToken);
        }
    }, [accessToken]);

    // Tipo output login
    interface Login {
        success: string;
        message: string;
        status: number;
        data: {
            accessToken: string;
            subject: {
                id: string;
                email: string;
                role: 'user' | 'admin';
                updatedAt: Date;
                createdAt: Date;
            };
        };
    }

    // Tipo output registrazione
    interface Register {
        success: string;
        message: string;
        status: number;
        data: {
            user: {
                id: string;
                email: string;
                role: 'user' | 'admin';
                updatedAt: Date;
                createdAt: Date;
            };
        };
    }

    // Funzione login
    async function login(
        email: string,
        psw: string,
        setLoading: React.Dispatch<React.SetStateAction<boolean>>,
        setError: React.Dispatch<React.SetStateAction<string>>
    ) {
        // Gestione errori
        try {
            // Richiesta login
            const res = await axios.post<Login | undefined>(
                `${import.meta.env.VITE_API_URL}/auth/login`,
                { email, psw, type: 'user' }
            );

            // Controllo dati
            if (!res.data || !res.data?.success)
                throw new Error(res.data?.message || 'Errore nella richiesta!');

            // Impostazione token
            setAccessToken(res.data.data.accessToken);
            // Impostazione utente
            setUser(res.data.data.subject);
        } catch (error: unknown) {
            const errorMsg =
                error instanceof Error
                    ? error?.message || 'Errore interno del server!'
                    : 'Errore sconosciuto!';
            // Impostazione errore
            setError(errorMsg);
        } finally {
            // Impostazione caricamento
            setLoading(false);
        }
    }

    // Funzione registrazione
    async function register(
        email: string,
        psw: string,
        setLoading: React.Dispatch<React.SetStateAction<boolean>>,
        setError: React.Dispatch<React.SetStateAction<string>>
    ) {
        // Gestione errori
        try {
            // Richiesta registrazione
            const res = await axios.post<Register | null>(
                `${import.meta.env.VITE_API_URL}/auth/register`,
                {
                    email,
                    psw,
                    type: 'user',
                }
            );

            // Controllo dati
            if (!res.data || !res.data?.success)
                throw new Error(res.data?.message || 'Errore nella richiesta!');
        } catch (error: unknown) {
            const errorMsg =
                error instanceof Error
                    ? error?.message || 'Errore interno del server!'
                    : 'Errore sconosciuto!';
            // Impostazione errore
            setError(errorMsg);
        } finally {
            // Impostazione caricamento
            setLoading(false);
        }
    }

    // Funzione logout
    async function logout(
        setLoading: React.Dispatch<React.SetStateAction<boolean>>,
        setError: React.Dispatch<React.SetStateAction<string>>
    ) {
        // Gestione errori
        try {
            // Richiesta logout
            const res = await axios.get<Register | null>(
                `${import.meta.env.VITE_API_URL}/auth/logout`
            );

            // Controllo dati
            if (!res.data || !res.data?.success)
                throw new Error(res.data?.message || 'Errore nella richiesta!');

            // Impostazione utente e accessToken
            setUser(null);
            setAccessToken(null);
        } catch (error: unknown) {
            const errorMsg =
                error instanceof Error
                    ? error?.message || 'Errore interno del server!'
                    : 'Errore sconosciuto!';
            // Impostazione errore
            setError(errorMsg);
        } finally {
            // Impostazione caricamento
            setLoading(false);
        }
    }

    // Funzione eliminazione account
    async function deleteAccount(
        setLoading: React.Dispatch<React.SetStateAction<boolean>>,
        setError: React.Dispatch<React.SetStateAction<string>>
    ) {
        // Gestione errori
        try {
            // Richiesta logout
            const res = await axios.delete<Register | null>(
                `${import.meta.env.VITE_API_URL}/api/user`
            );

            // Controllo dati
            if (!res.data || !res.data?.success)
                throw new Error(res.data?.message || 'Errore nella richiesta!');

            // Impostazione utente e accessToken
            setUser(null);
            setAccessToken(null);
        } catch (error: unknown) {
            const errorMsg =
                error instanceof Error
                    ? error?.message || 'Errore interno del server!'
                    : 'Errore sconosciuto!';
            // Impostazione errore
            setError(errorMsg);
        } finally {
            // Impostazione caricamento
            setLoading(false);
        }
    }

    return (
        <AuthContext.Provider
            value={{
                user,
                setUser,
                accessToken,
                login,
                register,
                logout,
                deleteAccount,
            }}
        >
            {children}
        </AuthContext.Provider>
    );
}

// Hook autenticazione
function useAuth() {
    return useContext(AuthContext);
}

// Esportazione hook e provider
export { useAuth, AuthProvider };
