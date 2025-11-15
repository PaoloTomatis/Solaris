// Importazione moduli
import { useState, useEffect } from 'react';
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
    // Stato tempo irrigazione
    const [irrigationTime, setIrrigationTime] = useState(120);

    // Controllo errore
    useEffect(() => {
        if (error) {
            notify('ERRORE!', error, 'error');
        }
    }, [error]);

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

                        // Controllo apertura connessione
                        socket.addEventListener('open', () => {
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
                            setTimeout(() => {
                                // Invio notifica
                                notify(
                                    'INVIO COMANDO',
                                    'Comando di irrigazione inviato correttamente!',
                                    'success'
                                );
                                // Chiusura connessione
                                socket.close();

                                // Impostazione tempo irrigazione e caricamento
                                setLoading(false);
                                setIrrigationTime(120);
                            }, 100);
                        });

                        // Controllo errori
                        socket.addEventListener('error', () => {
                            setLoading(false);
                            setError(
                                'Errore comunicazione o connessione a websocket!'
                            );
                        });
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
