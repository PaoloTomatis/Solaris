// Importazione moduli
import { useNavigate, useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import Page from '../components/Page.comp';
import BottomBar from '../components/BottomBar.comp';
import Data from '../components/Data.comp';
import Log from '../components/Log.comp';
import Separator from '../components/Separator.comp';
import Info from '../components/Info.comp';
import logTitle from '../utils/logTitle.utils';
import Error from '../components/Error.comp';
import Loading from '../components/Loading.comp';
import type {
    Device as DeviceType,
    Data as LogType,
} from '../utils/type.utils';
import { useAuth } from '../context/Auth.context';
import { getData } from '../utils/apiCrud.utils';
// Importazione immagini
import LogoIcon from '../assets/images/logo.svg?react';
import SignalIcon from '../assets/icons/network-status.svg?react';
import ArrowIcon from '../assets/icons/arrow.svg?react';
import TemperatureIcon from '../assets/icons/temperature.svg?react';
import LuminosityIcon from '../assets/icons/luminosity.svg?react';
import HumidityIcon from '../assets/icons/humidity.svg?react';
import LogIcon from '../assets/icons/log.svg?react';
import SettingsIcon from '../assets/icons/settings.svg?react';
import StatsIcon from '../assets/icons/statistics.svg?react';
import ControlsIcon from '../assets/icons/joystick.svg?react';
import DashboardIcon from '../assets/icons/dashboard.svg?react';

// Pagina dashboard
function Dashboard() {
    // Navigatore
    const navigator = useNavigate();
    // Id device
    const { id: deviceId } = useParams();

    // Stato colore icona
    const [iconColor, setIconColor] = useState('#00d68b');
    // Stato dispositivo
    const [device, setDevice] = useState<DeviceType | null>(null);
    // Stato logs
    const [logs, setLogs] = useState<LogType[] | null>(null);
    // Stato data
    const [data, setData] = useState<{
        id: string;
        temp: number;
        humI: number;
        humE: number;
        lum: number;
    } | null>(null);
    // Autenticazione
    const { accessToken } = useAuth();
    // Stato errore
    const [error, setError] = useState('');
    // Stato caricamento
    const [loading, setLoading] = useState(true);

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
                        setLogs,
                        accessToken,
                        'data',
                        'limit=3&type=log_info'
                    );
                    await getData(
                        setDevice,
                        accessToken,
                        'devices',
                        `id=${deviceId}`,
                        true
                    );
                }
                setData({
                    id: 'abc123',
                    temp: 20,
                    humI: 60,
                    humE: 54,
                    lum: 78,
                });
            } catch (error: any) {
                setError(error.message);
            } finally {
                setLoading(false);
            }
        };

        loadData();
    }, []);

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
    if (error) {
        return <Error error={error} setError={setError} />;
    }

    // Controllo caricamento
    if (loading) {
        return <Loading />;
    }

    return (
        // Pagina
        <Page className="gap-[25px] pt-[15vh]">
            {/* Contenitore barra superiore */}
            <div className="fixed top-0 left-0 w-full h-[14vh] backdrop-blur-[3px] z-40 flex items-center justify-between">
                {/* Freccia indietro */}
                <ArrowIcon
                    onClick={() => navigator('/devices')}
                    className="cursor-pointer w-[20px] rotate-180 fill-current text-primary-text z-[41] mr-1.5 ml-[30px]"
                />
                {/* Contenitore testi */}
                <div className="top-[20px] mx-auto gap-7 flex items-center justify-between w-full max-w-[400px]">
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
                                true ? 'text-success' : 'text-error'
                            } fill-current w-[20px]`}
                        />
                        {/* <p className="text-primary-text text-xsmall max-w-[100px] text-center">
                            {`${
                                device?.lastSeen
                                    ? device.lastSeen.getDate()
                                    : '-'
                            }/${
                                device.lastSeen
                                    ? device.lastSeen.getMonth()
                                    : '-'
                            }/${
                                device.lastSeen
                                    ? device.lastSeen.getFullYear()
                                    : '-'
                            } ${
                                device.lastSeen
                                    ? device.lastSeen.toLocaleTimeString()
                                    : '-'
                            }`}
                        </p> */}
                    </div>
                </div>
            </div>
            {/* Contenitore principale dati live */}
            <div className="flex flex-col items-center justify-center gap-5 w-full">
                {/* Titolo */}
                <div className="flex items-center justify-center gap-1.5 w-full">
                    <h2 className="text-primary-text text-medium font-bold">
                        Ultimi Dati
                    </h2>
                    <SignalIcon className="fill-current text-primary w-[25px] aspect-square" />
                </div>
                {/* Contenitore dati */}
                <div className="flex flex-col items-center justify-center gap-5 w-full">
                    <div className="flex items-center justify-center gap-7 w-full">
                        <Data
                            img={TemperatureIcon}
                            dato={`${data?.temp || '-'}°C`}
                        />
                        <Data
                            img={LuminosityIcon}
                            dato={`${data?.lum || '-'}%`}
                        />
                    </div>
                    <div className="flex items-center justify-center gap-7 w-full">
                        <Data
                            img={HumidityIcon}
                            dato={`${data?.humE || '-'}%`}
                        />
                        <Data
                            img={HumidityIcon}
                            dato={`${data?.humI || '-'}%`}
                        />
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
                                tit={logTitle(log.type)}
                                desc={log.desc}
                                type={log.type}
                                date={log.date}
                                read={log.read}
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
