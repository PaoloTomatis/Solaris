// Importazione moduli
import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import BottomBar from '../../components/global/BottomBar.comp';
import TopBar from '../../components/global/TopBar.comp';
import Page from '../../components/global/Page.comp';
import LogComp from '../../components/v2/Log.comp';
import Separator from '../../components/global/Separator.comp';
import Loading from '../../components/global/Loading.comp';
import type { Notifications as NotificationsType } from '../../utils/v2/type.utils';
import { getData } from '../../utils/v2/apiCrud.utils';
import { useAuth } from '../../context/v2/Auth.context';
import { useNotifications } from '../../context/global/Notifications.context';
import { useWSConnection } from '../../context/v2/WSConnection.context';

// Pagina log
function Logs() {
    // Id device
    const { id: deviceId } = useParams();

    // Autenticazione
    const { accessToken } = useAuth();
    // Notificatore
    const notify = useNotifications();
    // Stato logs
    const [logs, setLogs] = useState<NotificationsType[] | null>(null);
    // Stato caricamento
    const [loading, setLoading] = useState(true);
    // Stato errore
    const [error, setError] = useState('');
    // Connessione ws
    const ws = useWSConnection();

    // Caricamento pagina
    useEffect(() => {
        // Funziona caricamento dati
        const loadData = async () => {
            // Gestione errori
            try {
                // Controllo token
                if (accessToken) {
                    await getData(
                        accessToken,
                        'notifications',
                        setLogs,
                        `limit=50&deviceId=${deviceId}&sort=-createdAt`,
                    );
                }
            } catch (error: any) {
                setError(error.message);
            } finally {
                setLoading(false);
            }
        };

        loadData();
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
        <Page className="pt-[15vh]">
            {/* Barra superiore */}
            <TopBar url={`/dashboard/${deviceId}`}>Log</TopBar>
            {/* Contenitore log */}
            <div className="flex flex-col items-center justify-center gap-5 w-full">
                {logs && logs.length > 0 ? (
                    logs.map((log) => (
                        <LogComp
                            tit={log.title}
                            desc={log.description}
                            type={log.type}
                            date={new Date(log.createdAt)}
                            key={log.id}
                        />
                    ))
                ) : (
                    <p className="text-small font-bold text-primary-text text-center">
                        Non sono presenti LOG!
                    </p>
                )}
                {/* Contenitore separatore */}
                <div className="flex flex-col items-center justify-center w-full mt-10">
                    {/* Info separatore */}
                    <p className="text-primary-text text-xsmall">
                        Vengono visualizzati fino a 50 log
                    </p>
                    {/* Separatore */}
                    <Separator className="mt-0" />
                </div>
            </div>
            {/* Barra inferiore */}
            <BottomBar />
        </Page>
    );
}

// Esportazione pagina
export default Logs;
