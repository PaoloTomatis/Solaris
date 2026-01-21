// Importazione moduli
import { useState, useEffect, useRef } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useAuth } from '../../context/v1/Auth.context';
import { useNotifications } from '../../context/global/Notifications.context';
import BottomBar from '../../components/global/BottomBar.comp';
import TopBar from '../../components/global/TopBar.comp';
import Page from '../../components/global/Page.comp';
import Button from '../../components/global/Button.comp';
import InputCont from '../../components/global/InputCont.comp';
import Loading from '../../components/global/Loading.comp';
// Importazione immagini
import InfoIcon from '../assets/icons/info.svg?react';

// Pagina controlli
function Controls() {
    // Id device
    const { id: deviceId } = useParams();
    // Autenticazione
    const { accessToken } = useAuth();
    // Notificatore
    const notify = useNotifications();
    // Stato errore
    const [error, setError] = useState('');
    // Stato caricamento
    const [loading, setLoading] = useState(false);
    // Stato tempo irrigazione
    const [irrigationTime, setIrrigationTime] = useState(120);
    // Riferimento socket
    const socketRef = useRef<WebSocket | null>(null);

    // Controllo errore
    useEffect(() => {
        if (error) {
            notify('ERRORE!', error, 'error');
        }
    }, [error]);

    // Caricamento componente
    useEffect(() => {
        // Apertura connessione
        socketRef.current = new WebSocket(
            `${import.meta.env.VITE_WS_URL}?token=${accessToken}&authType=user`,
        );

        // Controllo errori
        socketRef.current.onerror = () => {
            setLoading(false);
            setError('Errore comunicazione o connessione a websocket!');
        };

        socketRef.current.onmessage = (event) => {
            // Dichiarazione dati evento
            const eventData = JSON.parse(event.data);

            if (eventData.event == 'success') {
                // Invio notifica
                notify(
                    'INVIO COMANDO',
                    'Comando di irrigazione inviato correttamente!',
                    'success',
                );
                // Impostazione tempo irrigazione e caricamento
                setLoading(false);
                setIrrigationTime(120);
            } else if (eventData.event == 'error') {
                // Impostazione errore
                setError(eventData.message);
                // Impostazione tempo irrigazione e caricamento
                setLoading(false);
                setIrrigationTime(120);
            }
        };

        // Pulizia connessione
        return () => socketRef.current?.close();
    }, []);

    // Controllo caricamento
    if (loading) {
        return <Loading />;
    }

    return (
        // Pagina
        <Page className="pt-[15vh] gap-5">
            {/* Barra superiore */}
            <TopBar url={`/dashboard/${deviceId}`}>Controlli Manuali</TopBar>
            {/* Contenitore input */}
            <InputCont
                type="number"
                value={irrigationTime}
                setValue={setIrrigationTime}
            >
                Tempo Irrigazione:
            </InputCont>
            {/* Pulsante */}
            <Button
                onClick={() => {
                    // Gestione errori
                    try {
                        // Controllo stato connessione
                        if (
                            socketRef.current &&
                            socketRef.current.readyState === WebSocket.OPEN
                        ) {
                            // Impostazione caricamento
                            setLoading(true);

                            // Invio evento
                            socketRef.current.send(
                                JSON.stringify({
                                    event: 'v1/irrigation',
                                    data: {
                                        duration: irrigationTime,
                                        completed: true,
                                        deviceId,
                                    },
                                }),
                            );
                        }
                    } catch (error: any) {
                        // Impostazione errore e caricamento
                        setError(error.message);
                        setLoading(false);
                    }
                }}
                className="mt-[10px] bg-primary max-w-max"
            >
                Avvia Irrigazione
            </Button>
            {/* Contenitore info */}
            <div className="flex items-center justify-center absolute bottom-[20vh] left-0 w-full gap-4">
                <InfoIcon className="fill-current text-info w-[30px] aspect-square" />
                <p className="text-primary-text text-xsmall max-w-[300px]">
                    L'irrigazione manuale servirà per poter calcolare le soglie
                    per la modalità automatica. Si consiglia di effettuare
                    alcune prove con i controlli manuali per poi{' '}
                    <Link
                        className="font-semibold"
                        to={`/dashboard/${deviceId}/settings`}
                    >
                        eliminare completamente i dati
                    </Link>
                </p>
            </div>
            {/* Barra inferiore */}
            <BottomBar />
        </Page>
    );
}

// Esportazione pagina
export default Controls;
