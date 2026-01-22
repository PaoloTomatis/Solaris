// Importazione moduli
import { type ReactNode, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/v1/Auth.context';
import Loading from '../global/Loading.comp';

// Componente dati
function ProtectedRoute({ children }: { children: ReactNode }) {
    // Autenticazione
    const { accessToken, loading } = useAuth();
    // Navigatore
    const navigator = useNavigate();
    // Url corrente
    const location = useLocation();

    // Controllo caricamento
    useEffect(() => {
        if (!loading && !accessToken) {
            navigator(
                `/auth?page=${encodeURIComponent(
                    location.pathname + location.search,
                )}`,
            );
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
