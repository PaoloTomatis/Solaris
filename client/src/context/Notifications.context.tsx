// Importazione moduli
import {
    createContext,
    useContext,
    useEffect,
    useState,
    type ReactNode,
} from 'react';
import Notifications from '../components/Notifications.comp';

// Tipo contesto notifiche
interface NotificationsContextType {}

// Contesto notifiche
const NotificationsContext = createContext<NotificationsContextType | null>(
    null
);

// Provider notifiche
function NotificationsProvider({ children }: { children: ReactNode }) {
    // Stato visualizzazione notifications
    const [show, setShow] = useState(false);
    // Stato titolo
    const [title, setTitle] = useState('');
    // Stato descrizione
    const [desc, setDesc] = useState('');
    // Stato tipo
    const [type, setType] = useState<'info' | 'error' | 'warning' | 'success'>(
        'info'
    );

    // Controllo visualizzazione
    useEffect(() => {
        if (!show) {
            setTitle('');
            setDesc('');
            setType('info');
        }
    }, [show]);

    // Funzione notificationsper
    function notify(
        title: string,
        desc: string,
        type: 'info' | 'error' | 'warning' | 'success'
    ) {
        setTitle(title);
        setDesc(desc);
        setType(type);
        setShow(true);
    }

    return (
        <NotificationsContext value={notify}>
            {show ? (
                <Notifications
                    tit={title}
                    desc={desc}
                    setVisible={setShow}
                    type={type}
                />
            ) : (
                ''
            )}
            {children}
        </NotificationsContext>
    );
}

// Hook notifiche
function useNotifications(): NotificationsContextType {
    const context = useContext(NotificationsContext);
    // Controllo contesto
    if (!context) {
        throw new Error(
            'useNotifications deve essere usato in un NotificationsProvider'
        );
    }
    return context;
}

// Esportazione hook e provider
export { useNotifications, NotificationsProvider };
