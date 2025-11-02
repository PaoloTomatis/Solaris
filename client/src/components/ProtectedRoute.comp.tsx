// Importazione moduli
import { type ReactNode, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/Auth.context';
import Loading from './Loading.comp';

// Componente dati
function ProtectedRoute({ children }: { children: ReactNode }) {
    // Autenticazione
    const { accessToken, loading } = useAuth();
    // Navigatore
    const navigator = useNavigate();

    // Controllo caricamento
    useEffect(() => {
        if (!loading && !accessToken) {
            navigator('/auth');
        }
    }, [loading]);

    // Controllo accessToken
    if (accessToken) {
        return children;
    }

    return <Loading />;
}

// Esportazione componente
export default ProtectedRoute;
