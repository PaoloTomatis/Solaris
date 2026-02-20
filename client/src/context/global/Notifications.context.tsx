// Importazione moduli
import {
    createContext,
    useContext,
    useEffect,
    useState,
    type ReactNode,
} from 'react';
import Notifications from '../../components/global/Notifications.comp';

// Tipo tipi notifications
type NotificationsType = 'info' | 'error' | 'warning' | 'success';

// Tipo impostazione notifications
interface NotificationsOptions {
    title: string;
    desc?: string;
    type?: NotificationsType;
}

// Contesto notifications
const NotificationsContext = createContext<
    ((title: string, desc?: string, type?: NotificationsType) => void) | null
>(null);

// Provider notifications
function NotificationsProvider({ children }: { children: ReactNode }) {
    // Stato visualizzazione notifications
    const [show, setShow] = useState(false);
    // Stato notifications
    const [notifications, setNotifications] =
        useState<NotificationsOptions | null>(null);

    // Controllo visualizzazione
    useEffect(() => {
        let id: NodeJS.Timeout;
        if (!show) {
            setNotifications(null);
        } else {
            id = setTimeout(() => {
                setShow(false);
            }, 3000);
        }

        return () => clearTimeout(id);
    }, [show]);

    // Funzione notify
    function notify(
        title: string,
        desc?: string,
        type?: 'info' | 'error' | 'warning' | 'success',
    ) {
        setNotifications({ title, desc, type });
        setShow(true);
    }

    return (
        <NotificationsContext value={notify}>
            {show ? (
                <Notifications
                    tit={notifications?.title || ''}
                    desc={notifications?.desc || ''}
                    setVisible={setShow}
                    type={notifications?.type || 'info'}
                />
            ) : (
                ''
            )}
            {children}
        </NotificationsContext>
    );
}

// Hook notifications
function useNotifications() {
    const context = useContext(NotificationsContext);
    // Controllo contesto
    if (!context) {
        throw new Error('useNotifications must be in a NotificationsProvider');
    }
    return context;
}

// Esportazione hook e provider
export { useNotifications, NotificationsProvider };
