// Importazione moduli
import { useEffect } from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { AuthProvider } from '../../context/v2/Auth.context';
import { NotificationsProvider } from '../../context/global/Notifications.context';
import { PopupProvider } from '../../context/global/Popup.context';
import { WSConnectionProvider } from '../../context/v2/WSConnection.context';

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
        return (
            <AuthProvider>
                <NotificationsProvider>
                    <WSConnectionProvider>
                        <PopupProvider>
                            <Outlet />
                        </PopupProvider>
                    </WSConnectionProvider>
                </NotificationsProvider>
            </AuthProvider>
        );
    } else {
        return (
            <Navigate
                to={`/warning?page=${encodeURIComponent(
                    location.pathname + location.search,
                )}`}
                replace
            />
        );
    }
};

export default Parent;
