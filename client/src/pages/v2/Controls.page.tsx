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
import { getOneData, postData } from '../../utils/v2/apiCrud.utils';
// Importazione immagini
import InfoIcon from '../../assets/icons/info.svg?react';
import type { DeviceSettings } from '../../utils/v2/type.utils';

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
    const [irrigationInput, setIrrigationInput] = useState(0);
    // Stato dispositivo
    const [status, setStatus] = useState<boolean>(false);
    // Stato impostazioni
    const [settings, setSettings] = useState<DeviceSettings | null>(null);
    // Gestore connessione ws
    const ws = useWSConnection();
    // Stato timeout
    const statusTimeout = useRef<NodeJS.Timeout | null>(null);

    // Caricamento pagina
    useEffect(() => {
        // Funziona caricamento dati
        const loadData = async () => {
            // Gestione errori
            try {
                // Controllo token
                if (accessToken) {
                    await getOneData(
                        accessToken,
                        `devices-settings/${deviceId}`,
                        setSettings,
                    );
                }
            } catch (error: any) {
                setError(error.message);
            } finally {
                setLoading(false);
            }
        };

        loadData();

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
            // Iscrizione evento notifiche
            unsubscribes.push(
                ws.subscribe(deviceId, 'notifications', (eventData: any) => {
                    // Invio notifica
                    notify(
                        eventData?.notification?.title,
                        eventData?.notification?.description,
                        eventData?.notification?.type,
                        7,
                    );
                }),
            );

            // Iscrizione evento irrigazioni
            unsubscribes.push(
                ws.subscribe(deviceId, 'irrigations', (eventData: any) => {
                    // Invio notifica
                    notify(
                        `IRRIGAZIONE ${eventData?.irrigation?.type == 'auto' ? 'AUTOMATICA' : 'MANUALE'}`,
                        `Intervallo: ${eventData?.irrigation?.interval}sec | Umidità Interna: ${eventData?.irrigation?.humIBefore?.toFixed(1)}% --> ${eventData?.irrigation?.humIAfter.toFixed(1)}% | Luminosità: ${eventData?.irrigation?.lum?.toFixed(1)}% | Umidità Esterna: ${eventData?.irrigation?.humE}% | Temperatura: ${eventData?.irrigation?.temp}°C`,
                        'success',
                    );
                }),
            );

            // Iscrizione evento misurazioni
            unsubscribes.push(
                ws.subscribe(deviceId, 'measurements', (eventData: any) => {
                    // Invio notifica
                    notify(
                        'MISURAZIONE',
                        `Umidità Interna: ${eventData?.measurement?.humI?.toFixed(1)}% | Luminosità: ${eventData?.measurement?.lum?.toFixed(1)}% | Umidità Esterna: ${eventData?.measurement?.humE}% | Temperatura: ${eventData?.measurement?.temp}°C`,
                        'success',
                    );
                }),
            );

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

            // Iscrizione evento errore
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

    // Controllo stato
    if (!status) {
        return (
            <Page className="justify-center">
                {/* Titolo */}
                <h1 className="text-primary-text text-medium font-bold leading-1">
                    DISPOSITIVO NON CONNESSO
                </h1>
                {/* Descrizione */}
                <p className="text-secondary-text text-small mt-3 w-[95%] max-w-[500px] text-center">
                    Il dispositivo non è attualmente disponibile e non può
                    ricevere dei comandi, prova a resettarlo o riprova più tardi
                </p>
                {/* Pulsante */}
                <Button
                    link={`/dashboard/${deviceId}`}
                    className="mt-[20px] bg-primary max-w-max"
                >
                    Torna alla Dashboard
                </Button>
                {/* Barra inferiore */}
                <BottomBar />
            </Page>
        );
    }

    // Controllo impostazioni
    if (settings?.mode !== 'config') {
        return (
            <Page className="justify-center">
                {/* Titolo */}
                <h1 className="text-primary-text text-medium font-bold leading-1">
                    DISPOSITIVO non CONTROLLABILE
                </h1>
                {/* Descrizione */}
                <p className="text-secondary-text text-small mt-3 w-[95%] max-w-[500px] text-center">
                    Il dispositivo non è in modalità configurazione e questo non
                    gli permette di ricevere comandi, prova a cambiare
                    impostazioni e riprova più tardi
                </p>
                {/* Pulsante */}
                <Button
                    link={`/dashboard/${deviceId}/settings`}
                    className="mt-[20px] bg-primary max-w-max"
                >
                    Aggiorna le Impostazioni
                </Button>
                {/* Barra inferiore */}
                <BottomBar />
            </Page>
        );
    }

    return (
        // Pagina
        <Page className="pt-[15vh] gap-5">
            {/* Barra superiore */}
            <TopBar url={`/dashboard/${deviceId}`}>Controlli Manuali</TopBar>
            {settings &&
            settings.kInterval &&
            settings.humIMax &&
            settings.humIMin ? (
                <>
                    <InputCont
                        type="number"
                        value={irrigationInput}
                        setValue={setIrrigationInput}
                    >
                        Variazione Umidità:
                    </InputCont>
                    <Button
                        onClick={async () => {
                            // Gestione errori
                            try {
                                // Controllo token
                                if (accessToken) {
                                    await postData(
                                        'irrigations/execute',
                                        'api',
                                        accessToken,
                                        {
                                            humI: irrigationInput,
                                            deviceId,
                                        },
                                    );
                                }
                            } catch (error: any) {
                                setError(error.message);
                            } finally {
                                setLoading(false);
                            }
                        }}
                        className="mt-[10px] bg-primary max-w-max"
                    >
                        Avvia Irrigazione
                    </Button>
                </>
            ) : (
                <>
                    <InputCont
                        type="number"
                        value={irrigationInput}
                        setValue={setIrrigationInput}
                    >
                        Tempo Irrigazione:
                    </InputCont>
                    <Button
                        onClick={async () => {
                            // Gestione errori
                            try {
                                // Controllo token
                                if (accessToken) {
                                    await postData(
                                        'irrigations/execute',
                                        'api',
                                        accessToken,
                                        {
                                            interval: irrigationInput,
                                            deviceId,
                                        },
                                    );
                                }
                            } catch (error: any) {
                                setError(error.message);
                            } finally {
                                setLoading(false);
                            }
                        }}
                        className="mt-[10px] bg-primary max-w-max"
                    >
                        Avvia Irrigazione
                    </Button>
                </>
            )}
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
