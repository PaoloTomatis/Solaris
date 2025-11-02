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
import { jwtDecode, type JwtPayload } from 'jwt-decode';
import { useNavigate } from 'react-router-dom';

// Tipo contesto autenticazione
interface AuthContextType {
    user: UserType | null;
    setUser: React.Dispatch<React.SetStateAction<UserType | null>>;
    accessToken: string | null;
    login: (
        email: string,
        psw: string,
        setLoading: React.Dispatch<React.SetStateAction<boolean>>,
        setError: React.Dispatch<React.SetStateAction<string>>
    ) => Promise<void>;
    register: (
        email: string,
        psw: string,
        setLoading: React.Dispatch<React.SetStateAction<boolean>>,
        setError: React.Dispatch<React.SetStateAction<string>>
    ) => Promise<void>;
    logout: (
        setLoading: React.Dispatch<React.SetStateAction<boolean>>,
        setError: React.Dispatch<React.SetStateAction<string>>
    ) => Promise<void>;
    deleteAccount: (
        setLoading: React.Dispatch<React.SetStateAction<boolean>>,
        setError: React.Dispatch<React.SetStateAction<string>>
    ) => Promise<void>;
    loading: boolean;
}

// Dichiarazione contesto autenticazione
const AuthContext = createContext<AuthContextType | null>(null);

// Provider autenticazione
function AuthProvider({ children }: { children: ReactNode }) {
    // Stato utente
    const [user, setUser] = useState<UserType | null>(null);
    // Stato accessToken
    const [accessToken, setAccessToken] = useState<string | null>(null);
    // Stato caricamento
    const [loading, setLoading] = useState(true);
    // Navigatore
    const navigator = useNavigate();

    // Tipo payload utente jwt
    interface JwtUserPayload extends JwtPayload {
        id: string;
        email: string;
        role: 'user' | 'admin';
        updatedAt: string;
        createdAt: string;
    }

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

    // Funzione controllo token
    function jwtCheck(token: string): null | UserType {
        // Gestione errori
        try {
            // Decodifica token
            const decoded = jwtDecode<JwtUserPayload>(token || '');
            // Controllo token
            if (decoded.exp && decoded.exp * 1000 > Date.now() && token) {
                return {
                    id: decoded.id,
                    email: decoded.email,
                    role: decoded.role,
                    updatedAt: new Date(decoded.updatedAt),
                    createdAt: new Date(decoded.createdAt),
                };
            }
            return null;
        } catch (error) {
            return null;
        }
    }

    // Caricamento componente
    useEffect(() => {
        // Ricavazione token
        const token = localStorage.getItem('accessToken');

        // Check token
        const user = jwtCheck(token || '');

        // Controllo utente
        if (user) {
            // Impostazione token
            setAccessToken(token);
            setUser(user);
        } else {
            // Eliminazione token
            localStorage.removeItem('accessToken');
            // Impostazione utente e token
            setUser(null);
            setAccessToken(null);
        }

        // Impostazione caricamento
        setLoading(false);
    }, []);

    // Funzione login
    async function login(
        email: string,
        psw: string,
        setLoading: React.Dispatch<React.SetStateAction<boolean>>,
        setError: React.Dispatch<React.SetStateAction<string>>
    ) {
        // Gestione errori
        try {
            // Impostazione caricamento
            setLoading(true);
            // Richiesta login
            const res = await axios.post<Login | undefined>(
                `${import.meta.env.VITE_API_URL}/auth/login`,
                { email, psw, type: 'user' }
            );

            // Controllo dati
            if (!res.data || !res.data?.success)
                throw new Error(res.data?.message || 'Errore nella richiesta!');

            // Check token
            const user = jwtCheck(res.data.data.accessToken || '');

            // Controllo utente
            if (user) {
                // Impostazione token
                setAccessToken(res.data.data.accessToken);
                localStorage.setItem('accessToken', res.data.data.accessToken);
                // Impostazione utente
                setUser(user);

                navigator('/account');
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
            // Impostazione caricamento
            setLoading(true);
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

            navigator('/auth/login');
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
            // Impostazione caricamento
            setLoading(true);
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

            navigator('/');
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

    // Funzione eliminazione account
    async function deleteAccount(
        setLoading: React.Dispatch<React.SetStateAction<boolean>>,
        setError: React.Dispatch<React.SetStateAction<string>>
    ) {
        // Gestione errori
        try {
            // Impostazione caricamento
            setLoading(true);
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

            navigator('/');
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
                loading,
            }}
        >
            {children}
        </AuthContext.Provider>
    );
}

// Hook autenticazione
function useAuth(): AuthContextType {
    const context = useContext(AuthContext);
    // Controllo contesto
    if (!context) {
        throw new Error('useAuth deve essere usato in un AuthProvider');
    }
    return context;
}

// Esportazione hook e provider
export { useAuth, AuthProvider };
