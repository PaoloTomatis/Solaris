// Importazione moduli
import { useNavigate, useParams } from 'react-router-dom';
import { useEffect, useState, useRef } from 'react';
import Page from '../../components/global/Page.comp';
import BottomBar from '../../components/global/BottomBar.comp';
import Data from '../../components/global/Data.comp';
import Log from '../../components/v2/Log.comp';
import Separator from '../../components/global/Separator.comp';
import Info from '../../components/global/Info.comp';
import Loading from '../../components/global/Loading.comp';
import type {
    Notifications as NotificationsType,
    Device as DeviceType,
    Measurements as MeasurementsType,
} from '../../utils/v2/type.utils';
import { useAuth } from '../../context/v2/Auth.context';
import { getData, getOneData } from '../../utils/v2/apiCrud.utils';
import { useNotifications } from '../../context/global/Notifications.context';
// Importazione immagini
import LogoIcon from '../../assets/images/logo.svg?react';
import SignalIcon from '../../assets/icons/network-status.svg?react';
import ArrowIcon from '../../assets/icons/arrow.svg?react';
import TemperatureIcon from '../../assets/icons/temperature.svg?react';
import LuminosityIcon from '../../assets/icons/luminosity.svg?react';
import HumidityIIcon from '../../assets/icons/humidityI.svg?react';
import HumidityEIcon from '../../assets/icons/humidityE.svg?react';
import LogIcon from '../../assets/icons/log.svg?react';
import SettingsIcon from '../../assets/icons/settings.svg?react';
import StatsIcon from '../../assets/icons/statistics.svg?react';
import ControlsIcon from '../../assets/icons/joystick.svg?react';
import DashboardIcon from '../../assets/icons/dashboard.svg?react';
import MeasurementIcon from '../../assets/icons/measurement.svg?react';
import IrrigationIcon from '../../assets/icons/irrigation.svg?react';
import { useWSConnection } from '../../context/v2/WSConnection.context';

// Pagina dashboard
function Dashboard() {
    // Navigatore
    const navigator = useNavigate();
    // Id device
    const { id: deviceId } = useParams();
    // Notificatore
    const notify = useNotifications();
    // Iscrizione eventi
    const ws = useWSConnection();

    // Stato colore icona
    const [iconColor, setIconColor] = useState('#00d68b');
    // Stato dispositivo
    const [device, setDevice] = useState<DeviceType | null>(null);
    // Stato logs
    const [logs, setLogs] = useState<NotificationsType[] | null>(null);
    // Autenticazione
    const { accessToken } = useAuth();
    // Stato dati in tempo reale
    const [realTimeData, setRealTimeData] = useState<MeasurementsType | null>(
        null,
    );
    // Stato timeout
    const statusTimeout = useRef<NodeJS.Timeout | null>(null);
    // Stato errore
    const [error, setError] = useState('');
    // Stato caricamento
    const [loading, setLoading] = useState(true);
    // Stato condizione
    const [status, setStatus] = useState<Date | null>(null);

    // Dichiarazione lista modelli
    const models = { vega: '#ffd60a', helios: '#00d4d8' };

    // Caricamento componente
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
                        `limit=3&deviceId=${deviceId}&sort=-createdAt`,
                    );
                    await getOneData(
                        accessToken,
                        'devices',
                        setDevice,
                        `id=${deviceId}`,
                    );
                    await getOneData(
                        accessToken,
                        'measurements',
                        setRealTimeData,
                        `deviceId=${deviceId}&limit=1&sort=-measuredAt`,
                    );
                }

                setRealTimeData((prev) => {
                    return prev?.measuredAt
                        ? {
                              ...prev,
                              measuredAt: new Date(prev?.measuredAt),
                          }
                        : prev;
                });
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
            // Iscrizione evento misurazioni
            unsubscribes.push(
                ws.subscribe(deviceId, 'measurements', (eventData: any) => {
                    // Impostazione dati in tempo reale
                    setRealTimeData({
                        ...eventData.measurements,
                        measuredAt: new Date(eventData.measurements.measuredAt),
                    });
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
                    // Impostazione notifiche
                    setLogs((prev) => {
                        return prev
                            ? [eventData.notification, ...prev]
                            : [eventData.notification];
                    });
                }),
            );

            // Iscrizione evento stato
            unsubscribes.push(
                ws.subscribe(deviceId, 'status', (eventData: any) => {
                    // Impostazione dati
                    setStatus(new Date(eventData.lastSeen));

                    // Reset timeout precedente
                    if (statusTimeout.current) {
                        clearTimeout(statusTimeout.current);
                    }

                    // Impostazione timeout
                    statusTimeout.current = setTimeout(() => {
                        setStatus(null);
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

    // Controllo id dispositivo
    useEffect(() => {
        if (!deviceId) {
            // Reindirizzamento
            navigator('/devices');

            // Impostazione errore
            setError('Id dispositivo mancante!');
        }
    }, [deviceId]);

    // Controllo dispositivo
    useEffect(() => {
        // Controllo modello
        for (const [model, color] of Object.entries(models)) {
            if (device?.prototypeModel?.toLowerCase().includes(model)) {
                setIconColor(color);
            }
        }
    }, [device]);

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
        <Page className="gap-[25px] pt-[15vh]">
            {/* Contenitore barra superiore */}
            <div className="fixed top-0 left-0 w-full h-[14vh] backdrop-blur-[3px] z-40 flex items-center justify-center px-[5%]">
                {/* Freccia indietro */}
                <ArrowIcon
                    onClick={() => navigator('/devices')}
                    className="cursor-pointer w-[20px] rotate-180 fill-current text-primary-text z-[41]"
                />
                {/* Contenitore testi */}
                <div className="top-[20px] gap-7 flex items-center justify-between w-full max-w-[400px] px-[30px]">
                    {/* Icona */}
                    <div className="bg-primary-text rounded-full flex flex-col items-center justify-center w-[50px] h-[50px] aspect-square">
                        <LogoIcon
                            className="stroke-current fill-none w-[45px] h-[45px] aspect-square"
                            style={{ color: iconColor }}
                        />
                    </div>
                    {/* Testi */}
                    <div className="flex flex-col items-start justify-center">
                        <h3 className="text-medium font-bold text-primary-text leading-6">
                            {device?.name || '-'}
                        </h3>
                        <p className="text-xsmall text-primary-text">
                            {device?.prototypeModel || '-'}
                        </p>
                    </div>
                    {/* Testo stato */}
                    <div className="flex flex-col items-center justify-center">
                        <SignalIcon
                            className={`${
                                status ? 'text-success' : 'text-error'
                            } fill-current w-[20px]`}
                        />
                        {status && (
                            <p className="text-primary-text text-xsmall max-w-[100px] text-center">
                                {`${status.toLocaleDateString() || '-'} ${
                                    status.toLocaleTimeString() || '-'
                                }`}
                            </p>
                        )}
                    </div>
                </div>
            </div>
            {/* Contenitore principale dati live */}
            <div className="flex flex-col items-center justify-center gap-5 w-full">
                <div className="flex flex-col">
                    {/* Titolo */}
                    <div className="flex items-center justify-center gap-1.5 w-full">
                        <h2 className="text-primary-text text-medium font-bold">
                            Ultimi Dati
                        </h2>
                        <SignalIcon className="fill-current text-primary w-[25px] aspect-square" />
                    </div>
                    {/* Data */}
                    <p className="text-primary-text text-xsmall">{`${
                        realTimeData?.measuredAt?.toLocaleDateString() || '-'
                    } - ${realTimeData?.measuredAt?.toLocaleTimeString() || '-'}`}</p>
                </div>
                {/* Contenitore dati */}
                <div className="flex flex-col items-center justify-center gap-5 w-full">
                    <div className="flex items-center justify-center gap-7 w-full">
                        <Data
                            img={TemperatureIcon}
                            dato={`${realTimeData?.temp || '-'}°C`}
                        />
                        <Data
                            img={LuminosityIcon}
                            dato={`${realTimeData?.lum?.toFixed(1) || '-'}%`}
                        />
                    </div>
                    <div className="flex items-center justify-center gap-7 w-full">
                        <div className="flex items-center justify-center relative">
                            <Data
                                img={HumidityEIcon}
                                dato={`${realTimeData?.humE || '-'}%`}
                            />
                        </div>
                        <div className="flex items-center justify-center relative">
                            <Data
                                img={HumidityIIcon}
                                dato={`${
                                    realTimeData?.humI?.toFixed(1) || '-'
                                }%`}
                            />
                        </div>
                    </div>
                </div>
            </div>
            <Separator />
            {/* Contenitore principale ultimi log */}
            <div className="flex flex-col items-center justify-center gap-5 w-full">
                {/* Titolo */}
                <div className="flex items-center justify-center gap-1.5 w-full">
                    <h2 className="text-primary-text text-medium font-bold">
                        Ultimi Log
                    </h2>
                    <LogIcon className="fill-current text-primary w-[25px] aspect-square" />
                </div>
                {/* Contenitore log */}
                <div className="flex flex-col items-center justify-center gap-5 w-full">
                    {logs && logs.length > 0 ? (
                        logs.map((log) => (
                            <Log
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
                </div>
            </div>
            <Separator />
            {/* Contenitore principale info */}
            <div className="flex flex-col items-center justify-center gap-5 w-full">
                {/* Titolo */}
                <div className="flex items-center justify-center gap-1.5 w-full">
                    <h2 className="text-primary-text text-medium font-bold">
                        Altre Sezioni
                    </h2>
                    <DashboardIcon className="fill-current text-primary w-[25px] aspect-square" />
                </div>
                {/* Contenitore info */}
                <div className="flex flex-col items-center justify-center gap-3 w-full">
                    <Info
                        url={`/dashboard/${deviceId}/settings`}
                        name="Impostazioni Dispositivo"
                        icon={SettingsIcon}
                    />
                    <Info
                        url={`/dashboard/${deviceId}/log`}
                        name="Log"
                        icon={LogIcon}
                    />
                    <Info
                        url={`/dashboard/${deviceId}/measurements`}
                        name="Misurazioni"
                        icon={MeasurementIcon}
                    />
                    <Info
                        url={`/dashboard/${deviceId}/irrigations`}
                        name="Irrigazioni"
                        icon={IrrigationIcon}
                    />
                    <Info
                        url={`/dashboard/${deviceId}/stats`}
                        name="Statistiche"
                        icon={StatsIcon}
                    />
                    <Info
                        url={`/dashboard/${deviceId}/controls`}
                        name="Controlli Manuali"
                        icon={ControlsIcon}
                    />
                </div>
            </div>
            {/* Barra inferiore */}
            <BottomBar />
        </Page>
    );
}

// Esportazione pagina
export default Dashboard;
