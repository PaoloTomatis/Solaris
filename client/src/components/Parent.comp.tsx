// Importazione moduli
import { useEffect } from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';

// Componente genitore
const Parent = () => {
    // Url corrente
    const location = useLocation();
    // Avviso
    const isWarned = sessionStorage.getItem('isWarned');

    // Caricamento componente
    useEffect(() => {
        // Scroll inizio
        window.scrollTo(0, 0);
    }, []);

    // Controllo avviso
    if (isWarned) {
        return <Outlet />;
    } else {
        return (
            <Navigate
                to={`/warning?page=${encodeURIComponent(
                    location.pathname + location.search
                )}`}
                replace
            />
        );
    }
};

export default Parent;
