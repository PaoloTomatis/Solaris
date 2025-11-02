// Importazione moduli
import { type ReactNode } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/Auth.context';

// Componente dati
function ProtectedRoute({ children }: { children: ReactNode }) {
    // Autenticazione
    const { accessToken } = useAuth();

    // Controllo token
    if (accessToken) {
        return children;
    }
    return <Navigate to={'/auth'} replace />;
}

// Esportazione componente
export default ProtectedRoute;
