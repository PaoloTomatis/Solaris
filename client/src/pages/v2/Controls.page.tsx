// Importazione moduli
import { useState, useEffect, useRef } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useAuth } from '../../context/v2/Auth.context';
import { useNotifications } from '../../context/global/Notifications.context';
import { useWSConnection } from '../../context/v2/WSConnection.context';
import BottomBar from '../../components/global/BottomBar.comp';
import TopBar from '../../components/global/TopBar.comp';
import Page from '../../components/global/Page.comp';
import Button from '../../components/global/Button.comp';
import InputCont from '../../components/global/InputCont.comp';
import Loading from '../../components/global/Loading.comp';
import { postData } from '../../utils/v2/apiCrud.utils';
// Importazione immagini
import InfoIcon from '../../assets/icons/info.svg?react';

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
    // Stato dispositivo
    const [status, setStatus] = useState<boolean>(false);
    // Gestore connessione ws
    const ws = useWSConnection();
    // Stato timeout
    const statusTimeout = useRef<NodeJS.Timeout | null>(null);

    // Caricamento pagina
    useEffect(() => {
        // Ritorno
        return () => {
            if (statusTimeout.current) {
                clearTimeout(statusTimeout.current);
            }
        };
    }, []);

    // Controllo ws
    useEffect(() => {
        if (!ws) return;

        // Lista funzioni rimozione iscrizione
        const unsubscribes: (() => void)[] = [];

        // Controllo id dispositivo
        if (deviceId) {
            // Iscrizione evento stato
            unsubscribes.push(
                ws.subscribe(deviceId, 'status', () => {
                    // Impostazione dati
                    setStatus(true);

                    // Reset timeout precedente
                    if (statusTimeout.current) {
                        clearTimeout(statusTimeout.current);
                    }

                    // Impostazione timeout
                    statusTimeout.current = setTimeout(() => {
                        setStatus(false);
                    }, 30000);
                }),
            );

            // Iscrizione evento stato
            unsubscribes.push(
                ws.subscribe(deviceId, 'error', (eventData: any) => {
                    // Impostazione errore
                    setError(eventData.message);
                }),
            );
        }

        return () => unsubscribes.forEach((unsubscribe) => unsubscribe());
    }, [ws, deviceId]);

    // Controllo errore
    useEffect(() => {
        if (error) {
            notify('ERRORE!', error, 'error', 3);
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
                type={status ? 'info' : 'error'}
                onClick={
                    status
                        ? async () => {
                              // Gestione errori
                              try {
                                  // Controllo token
                                  if (accessToken) {
                                      await postData(
                                          'irrigations/execute',
                                          'api',
                                          accessToken,
                                          {
                                              interval: irrigationTime,
                                              deviceId,
                                          },
                                      );
                                  }
                              } catch (error: any) {
                                  setError(error.message);
                              } finally {
                                  setLoading(false);
                              }
                          }
                        : () => {
                              notify(
                                  'DISPOSITIVO INATTIVO',
                                  'Il dispositivo è al momento irrangiungibile e non può ricevere comandi',
                                  'error',
                              );
                          }
                }
                className="mt-[10px] max-w-max"
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
