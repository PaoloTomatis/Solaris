// Importazione moduli
import { useState, useEffect, useRef } from 'react';
import { useParams } from 'react-router-dom';
import { useAuth } from '../context/Auth.context';
import { useNotifications } from '../context/Notifications.context';
import BottomBar from '../components/BottomBar.comp';
import TopBar from '../components/TopBar.comp';
import Page from '../components/Page.comp';
import Button from '../components/Button.comp';
import InputCont from '../components/InputCont.comp';
import Loading from '../components/Loading.comp';
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
    // Stato apertura
    const [opened, setOpened] = useState<boolean | null>(null);
    // Stato tempo irrigazione
    const [irrigationTime, setIrrigationTime] = useState(120);
    // Riferimento id timeout
    const timeoutId = useRef<NodeJS.Timeout | null>(null);

    // Controllo errore
    useEffect(() => {
        if (error) {
            notify('ERRORE!', error, 'error');
        }
    }, [error]);

    // Controllo apertura connessione
    useEffect(() => {
        // Controllo apertura connessione
        if (opened !== null && opened == false) {
            console.log('Impostazione!');
            // Impostazione timeout
            timeoutId.current = setTimeout(() => {
                console.log('Impostazione Errore');
                setError(
                    'La connessione al dispositivo sta durando più del previsto!'
                );
            }, 1000);
        } else if (opened == true && timeoutId.current) {
            console.log('Pulizia!');
            // Pulizia timeout
            clearTimeout(timeoutId.current);
        }
    }, [opened]);

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
                        // Impostazione caricamento
                        setLoading(true);

                        // Apertura WebSocket
                        const socket = new WebSocket(
                            `${
                                import.meta.env.VITE_WS_URL
                            }?token=${accessToken}&authType=user`
                        );

                        // Impostazione apertura connessione
                        setOpened(false);

                        // Controllo apertura connessione
                        socket.addEventListener('open', () => {
                            // Impostazione apertura connessione
                            setOpened(true);
                            console.log('APERTURA');
                            // Invio evento
                            socket.send(
                                JSON.stringify({
                                    event: 'irrigation',
                                    data: {
                                        duration: irrigationTime,
                                        completed: true,
                                        deviceId,
                                    },
                                })
                            );
                            setLoading(false);
                        });

                        // Controllo errori
                        socket.addEventListener('error', () => {
                            // Impostazione apertura connessione
                            setOpened(null);
                            setError(
                                'Errore comunicazione o connessione a websocket!'
                            );
                        });

                        // Impostazione tempo irrigazione
                        setIrrigationTime(120);
                    } catch (error: any) {
                        setError(error.message);
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
                    alcune prove con i controlli manuali per poi eliminare
                    completamente i dati
                </p>
            </div>
            {/* Barra inferiore */}
            <BottomBar />
        </Page>
    );
}

// Esportazione pagina
export default Controls;
