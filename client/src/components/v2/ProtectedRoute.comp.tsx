// Importazione moduli
import { type ReactNode } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/v2/Auth.context';
import Loading from '../global/Loading.comp';

// Componente dati
function ProtectedRoute({ children }: { children: ReactNode }) {
    // Autenticazione
    const { accessToken, loading } = useAuth();
    // Url corrente
    const location = useLocation();

    // Controllo caricamento
    if (loading) {
        return <Loading />;
    }

    // Controllo accessToken
    if (!accessToken) {
        return (
            <Navigate
                to={`/auth?page=${encodeURIComponent(
                    location.pathname + location.search,
                )}`}
                replace
            />
        );
    }

    return children;
}

// Esportazione componente
export default ProtectedRoute;
