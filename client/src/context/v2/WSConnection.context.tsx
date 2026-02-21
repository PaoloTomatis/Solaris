// Importazione moduli
import {
    createContext,
    useContext,
    useEffect,
    useRef,
    type ReactNode,
} from 'react';
import { useAuth } from './Auth.context';
import { useNotifications } from '../global/Notifications.context';

// Tipo contesto connessione ws
interface WSConnectionContextType {
    status: 'open' | 'closed' | 'errored' | 'connecting';
    subscribe: (
        deviceId: string,
        event: keyof Listener['events'],
        callback: (eventData: any) => void,
    ) => () => void;
}

// listeners = [{deviceId, callbacks}]

// Tipo listener
interface Listener {
    deviceId: string;
    events: {
        measurements: ((eventData: any) => void)[];
        irrigations: ((eventData: any) => void)[];
        notifications: ((eventData: any) => void)[];
        status: ((eventData: any) => void)[];
        error: ((eventData: any) => void)[];
    };
}

// Dichiarazione contesto connessione ws
const WSConnectionContext = createContext<WSConnectionContextType | null>(null);

// Provider connessione ws
export function WSConnectionProvider({ children }: { children: ReactNode }) {
    // Autenticazione
    const { accessToken } = useAuth();
    // Notifiche
    const notify = useNotifications();
    // Riferimento socket
    const socket = useRef<WebSocket | null>(null);
    // Stato connessione
    const status = useRef<'open' | 'closed' | 'errored' | 'connecting'>(
        'closed',
    );
    // Riferimento listener
    const listeners = useRef<Listener[]>([]);
    // Riferimento tentativi
    const tentatives = useRef<number>(0);

    // Funzione connessione ws
    function connectWS() {
        // Impostazione stato
        status.current = 'connecting';

        // Controllo connessione
        if (socket.current) {
            // Chiusura connessione
            socket.current.close();
        }

        // Apertura connessione
        socket.current = new WebSocket(
            `${import.meta.env.VITE_WS_URL}?token=${accessToken}&authType=user&v=2`,
        );

        // Gestione apertura
        socket.current.onopen = () => {
            // Impostazione stato
            status.current = 'open';
        };

        // Gestione errori
        socket.current.onerror = () => {
            // Notifica
            notify(
                'ERRORE CONNESSIONE WS',
                'Errore comunicazione o connessione a websocket!',
            );
            // Impostazione stato
            status.current = 'errored';
        };

        // Funzione chiamata callback
        function eventCallbacks(
            deviceId: string,
            event: keyof Listener['events'],
            eventData: any,
        ) {
            // Ricerca listener da id dispositivo
            const listener = listeners.current?.find((listener) => {
                return listener.deviceId == deviceId;
            });

            // Controllo listener
            if (listener) {
                // Esecuzione callbacks
                listener.events[event]?.forEach((callback) => {
                    callback(eventData);
                });
            }
        }

        // Gestione messaggi
        socket.current.onmessage = (event) => {
            // Dichiarazione dati evento
            const eventData = JSON.parse(event.data);

            // Controllo tipo evento
            if (eventData.event == 'v2/measurements') {
                // Chiamata callbacks
                eventCallbacks(
                    eventData.measurements.deviceId,
                    'measurements',
                    eventData,
                );
            } else if (eventData.event == 'v2/irrigation') {
                // Chiamata callbacks
                eventCallbacks(
                    eventData.irrigation.deviceId,
                    'irrigations',
                    eventData,
                );
            } else if (eventData.event == 'v2/notifications') {
                // Chiamata callbacks
                eventCallbacks(
                    eventData.notification.deviceId,
                    'notifications',
                    eventData,
                );
            } else if (eventData.event == 'v2/status') {
                // Chiamata callbacks
                eventCallbacks(eventData.deviceId, 'status', eventData);
            } else if (eventData.event == 'error') {
                // Chiamata callbacks
                eventCallbacks(eventData.deviceId, 'error', eventData);
            }
        };

        // Gestione chiusura
        socket.current.onclose = () => {
            // Impostazione stato
            status.current = 'closed';
        };
    }

    // Funzione iscrizione evento
    function subscribe(
        deviceId: string,
        event: keyof Listener['events'],
        callback: (eventData: any) => void,
    ) {
        // Ricerca listener da id dispositivo
        let listener = listeners.current?.find((listener) => {
            return listener.deviceId == deviceId;
        });

        // Controllo listener
        if (!listener) {
            // Creazione listener
            listener = {
                deviceId,
                events: {
                    measurements: [],
                    irrigations: [],
                    notifications: [],
                    status: [],
                    error: [],
                },
            };
            listeners.current?.push(listener);
        }
        // Salvataggio callback
        listener.events[event].push(callback);

        // Rimozione iscrizione
        return () => {
            if (listener?.events[event]) {
                listener.events[event] = listener.events[event].filter(
                    (cb) => cb !== callback,
                );
            }
        };
    }

    // Controllo stato
    useEffect(() => {
        if (
            (status.current == 'closed' || status.current == 'errored') &&
            tentatives.current <= 5 &&
            accessToken
        ) {
            // Connessione ws
            connectWS();
            // Aggiornamento tentativi
            tentatives.current += 1;
        }

        return () => {
            // Controllo connessione
            if (socket.current) {
                // Chiusura connessione
                socket.current.close();
            }
        };
    }, [status, accessToken]);

    return (
        <WSConnectionContext.Provider
            value={{ status: status.current, subscribe }}
        >
            {children}
        </WSConnectionContext.Provider>
    );
}

// Hook connessione ws
export function useWSConnection() {
    // Contesto
    const context = useContext(WSConnectionContext);

    // Controllo contesto
    if (!context) {
        throw new Error('useWSConnection must be in an WSConnectionProvider');
    }

    // Ritorno contesto
    return context;
}
