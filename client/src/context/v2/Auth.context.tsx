// Importazione moduli
import {
    createContext,
    useContext,
    useState,
    type ReactNode,
    useEffect,
} from 'react';
import type {
    User as UserType,
    UserSettings as UserSettingsType,
    Login as LoginType,
} from '../../utils/v2/type.utils';
import axios from 'axios';
import { jwtDecode, type JwtPayload } from 'jwt-decode';
import { useNavigate } from 'react-router-dom';
import { deleteData, getOneData, postData } from '../../utils/v2/apiCrud.utils';

// Tipo contesto autenticazione
interface AuthContextType {
    user: UserType | null;
    setUser: React.Dispatch<React.SetStateAction<UserType | null>>;
    settings: UserSettingsType | null;
    setSettings: React.Dispatch<React.SetStateAction<UserSettingsType | null>>;
    accessToken: string | null;
    login: (
        email: string,
        psw: string,
        setLoading: React.Dispatch<React.SetStateAction<boolean>>,
        setError: React.Dispatch<React.SetStateAction<string>>,
    ) => Promise<void>;
    register: (
        email: string,
        psw: string,
        setLoading: React.Dispatch<React.SetStateAction<boolean>>,
        setError: React.Dispatch<React.SetStateAction<string>>,
    ) => Promise<void>;
    logout: (
        setLoading: React.Dispatch<React.SetStateAction<boolean>>,
        setError: React.Dispatch<React.SetStateAction<string>>,
    ) => Promise<void>;
    deleteAccount: (
        setLoading: React.Dispatch<React.SetStateAction<boolean>>,
        setError: React.Dispatch<React.SetStateAction<string>>,
    ) => Promise<void>;
    loading: boolean;
}

// Dichiarazione contesto autenticazione
const AuthContext = createContext<AuthContextType | null>(null);

// Provider autenticazione
function AuthProvider({ children }: { children: ReactNode }) {
    // Stato utente
    const [user, setUser] = useState<UserType | null>(null);
    // Stato impostazioni
    const [settings, setSettings] = useState<UserSettingsType | null>(null);
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
        updatedAt: string;
        createdAt: string;
    }

    // Funzione controllo token
    function jwtCheck(token: string) {
        // Gestione errori
        try {
            // Decodifica token
            const decoded = jwtDecode<JwtUserPayload>(token || '');

            // Controllo token
            if (decoded.exp && decoded.exp * 1000 > Date.now() && token) {
                return {
                    id: decoded.id,
                };
            }
            return null;
        } catch (error) {
            return null;
        }
    }

    // Funzione pulizia
    function clear(loading = false) {
        // Eliminazione impostazioni utente
        localStorage.removeItem('settings');
        // Impostazione utente e token
        setUser(null);
        setSettings(null);
        setAccessToken(null);
        if (loading)
            // Impostazione caricamento
            setLoading(false);
    }

    // Funzione configurazione
    async function config() {
        // Ricavazione token
        const token = await refresh();

        // Ricavazione impostazioni
        const rawSettings = localStorage.getItem('settings');
        const loadedSettings: UserSettingsType | null = rawSettings
            ? JSON.parse(rawSettings)
            : null;

        // Controllo token
        if (!token) {
            // Pulizia
            clear(true);

            // Ritorno
            return;
        }

        // Gestion errori
        try {
            // Richiesta utente
            const user = await getOneData<UserType | null>(
                token,
                'me',
                null,
                null,
            );

            // Controllo utente
            if (!user) {
                // Pulizia
                clear();

                // Ritorno
                return;
            }

            // Richiesta impostazioni
            const userSettings = await getOneData<UserSettingsType | null>(
                token,
                'me/user-settings',
            );

            // Impostazione impostazioni utente
            localStorage.setItem(
                'settings',
                JSON.stringify(userSettings || loadedSettings || null),
            );

            // Impostazione token
            setAccessToken(token);
            setUser(user);
            setSettings(userSettings || loadedSettings || null);
        } catch (error) {
            // Pulizia
            clear(true);

            // Ritorno
            return;
        } finally {
            // Impostazioni caricamento
            setLoading(false);
        }
    }

    // Caricamento componente
    useEffect(() => {
        config();
    }, []);

    // Controllo token
    useEffect(() => {
        // Controllo caricamento
        if (loading) return;

        // Controllo token
        if (!accessToken) return;

        // Conversione token
        const result = jwtCheck(accessToken);

        // Controllo risultato token
        if (!result) clear(true);
    }, [accessToken, loading]);

    // Controllo impostazioni
    useEffect(() => {
        // Impostazione modalità stile
        document.documentElement.classList.toggle(
            'dark',
            settings?.styleMode == 'dark',
        );

        // Controllo impostazioni
        if (settings) {
            // Impostazione impostazioni
            localStorage.setItem('settings', JSON.stringify(settings));
        } else {
            // Eliminazione impostazioni
            localStorage.removeItem('settings');
        }
    }, [settings]);

    // Funzione login
    async function login(
        email: string,
        psw: string,
        setLoading: React.Dispatch<React.SetStateAction<boolean>>,
        setError: React.Dispatch<React.SetStateAction<string>>,
    ) {
        // Gestione errori
        try {
            // Impostazione caricamento
            setLoading(true);

            // Richiesta login
            const loginRes = await postData<LoginType>(
                'user-login',
                'auth',
                null,
                { email, psw },
            );

            // Richiesta utente
            const user = await getOneData<UserType | null>(
                loginRes.accessToken,
                'me',
                null,
                null,
            );

            // Controllo utente
            if (user) {
                // Richiesta impostazioni
                const userSettings = await getOneData<UserSettingsType | null>(
                    loginRes.accessToken,
                    'me/user-settings',
                );

                // Impostazione token
                setAccessToken(loginRes.accessToken);

                // Impostazione impostazioni utente
                localStorage.setItem('settings', JSON.stringify(userSettings));
                setSettings(userSettings);

                // Impostazione utente
                setUser(user);
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
        setError: React.Dispatch<React.SetStateAction<string>>,
    ) {
        // Gestione errori
        try {
            // Impostazione caricamento
            setLoading(true);

            // Richiesta registrazione
            await postData<UserType>('user-register', 'auth', null, {
                email,
                psw,
            });
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

    // Funzione logout
    async function logout(
        setLoading: React.Dispatch<React.SetStateAction<boolean>>,
        setError: React.Dispatch<React.SetStateAction<string>>,
    ) {
        // Gestione errori
        try {
            // Impostazione caricamento
            setLoading(true);

            // Richiesta logout
            await postData<null>('logout', 'auth');

            // Impostazione utente e accessToken
            setUser(null);
            setSettings(null);
            setAccessToken(null);

            // Navigazione
            navigator('/auth/login');
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
        setError: React.Dispatch<React.SetStateAction<string>>,
    ) {
        // Gestione errori
        try {
            // Impostazione caricamento
            setLoading(true);

            // Richiesta eliminazione
            await deleteData<null>(accessToken || '', 'me');

            // Impostazione utente e accessToken
            setUser(null);
            setSettings(null);
            setAccessToken(null);

            // Navigazione
            navigator('/auth/register');
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

    // Funzione rinnovo token
    async function refresh() {
        // Gestione errori
        try {
            // Richiesta logout
            const res = await postData<LoginType>(
                'refresh',
                'auth',
                accessToken,
            );

            // Ritorno accessToken
            return res.accessToken;
        } catch (error: unknown) {
            return null;
        }
    }

    return (
        <AuthContext.Provider
            value={{
                user,
                setUser,
                settings,
                setSettings,
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
