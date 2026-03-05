// Importazione moduli
import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useAuth } from '../../context/v2/Auth.context';
import { useNotifications } from '../../context/global/Notifications.context';
import BottomBar from '../../components/global/BottomBar.comp';
import TopBar from '../../components/global/TopBar.comp';
import Page from '../../components/global/Page.comp';
import Loading from '../../components/global/Loading.comp';
import Calibration from '../../components/v2/Calibration.comp';
import { getData, getOneData } from '../../utils/v2/apiCrud.utils';
import type { DeviceSettings } from '../../utils/v2/type.utils';
// Importazione immagini
import LuminosityIcon from '../../assets/icons/luminosity.svg?react';
import HumidityIIcon from '../../assets/icons/humidityI.svg?react';

// Pagina controlli
function Calibrations() {
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
    const [settings, setSettings] = useState<DeviceSettings | null>(null);
    // Lista sensori 1
    const sensors1: {
        name: string;
        code: 'sensorHumIMax' | 'sensorHumIMin';
        rules: string;
    }[] = [
        {
            name: 'Umidità del Suolo (+)',
            code: 'sensorHumIMax',
            rules: "Immergi il sensore in un bicchiere d'acqua e premi il pulsante di calibrazione",
        },
        {
            name: 'Umidità del Suolo (-)',
            code: 'sensorHumIMin',
            rules: "Lascia il sensore all'aria aperta senza che tocchi nulla e premi il pulsante di calibrazione",
        },
    ];

    // Lista sensori 2
    const sensors2: {
        name: string;
        code: 'sensorLumMax' | 'sensorLumMin';
        rules: string;
    }[] = [
        {
            name: 'Luminosità (+)',
            code: 'sensorLumMax',
            rules: 'Metti il sensore in un luogo molto illuminato e premi il pulsante di calibrazione',
        },
        {
            name: 'Luminosità (-)',
            code: 'sensorLumMin',
            rules: 'Metti il sensore in un luogo molto buio e premi il pulsante di calibrazione',
        },
    ];

    // Caricamento pagina
    useEffect(() => {
        // Funzione caricamento dati
        const loadData = async () => {
            // Gestione errori
            try {
                // Controllo token
                if (accessToken) {
                    await getData(
                        accessToken,
                        `devices-settings/${deviceId}`,
                        setSettings,
                    );
                    await getOneData(
                        accessToken,
                        `devices/${deviceId}`,
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
    }, []);

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
            <TopBar url={`/dashboard/${deviceId}`}>Calibrazione</TopBar>
            {/* Contenitore calibrazioni sensori */}
            <div className="flex flex-col items-center justify-center gap-[10vh] w-full">
                <div className="flex flex-col items-center justify-center">
                    <HumidityIIcon className="w-[100px] text-decoration fill-current" />
                    <div className="flex items-center justify-center gap-[50px]">
                        {sensors1.map((sensor, idx) => {
                            return (
                                <Calibration
                                    code={sensor.code}
                                    setError={setError}
                                    setLoading={setLoading}
                                    name={sensor.name}
                                    deviceId={deviceId || ''}
                                    accessToken={accessToken || ''}
                                    value={
                                        settings
                                            ? settings[sensor.code]
                                            : undefined
                                    }
                                    rules={sensor.rules}
                                    key={idx}
                                />
                            );
                        })}
                    </div>
                </div>
                <div className="flex flex-col items-center justify-center">
                    <LuminosityIcon className="w-[100px] text-decoration fill-current" />
                    <div className="flex items-center justify-center gap-[50px]">
                        {sensors2.map((sensor, idx) => {
                            return (
                                <Calibration
                                    code={sensor.code}
                                    setError={setError}
                                    setLoading={setLoading}
                                    name={sensor.name}
                                    deviceId={deviceId || ''}
                                    accessToken={accessToken || ''}
                                    value={
                                        settings
                                            ? settings[sensor.code]
                                            : undefined
                                    }
                                    rules={sensor.rules}
                                    key={idx}
                                />
                            );
                        })}
                    </div>
                </div>
            </div>
            {/* Barra inferiore */}
            <BottomBar />
        </Page>
    );
}

// Esportazione pagina
export default Calibrations;
