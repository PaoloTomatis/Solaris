// Importazione moduli
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import Page from '../components/Page.comp';
import TopBar from '../components/TopBar.comp';
import BottomBar from '../components/BottomBar.comp';
import Info from '../components/Info.comp';
import Separator from '../components/Separator.comp';
import InputCont from '../components/InputCont.comp';
import Error from '../components/Error.comp';
import Loading from '../components/Loading.comp';
import type { Device } from '../utils/type.utils';
import type { DeviceSettings as DeviceSettingsType } from '../utils/type.utils';
import { useAuth } from '../context/Auth.context';
import { getData } from '../utils/apiCrud.utils';
import { usePopup } from '../context/Popup.context';
// Importazione immagini
// import EditIcon from '../assets/icons/edit.svg?react';
import LogoIcon from '../assets/images/logo.svg?react';
import ResetIcon from '../assets/icons/reset.svg?react';
import LogoutIcon from '../assets/icons/logout.svg?react';
import DeleteIcon from '../assets/icons/delete.svg?react';
import SaveIcon from '../assets/icons/save.svg?react';

// Pagina impostazione dispositivo
function DeviceSettings() {
    // Id device
    const { id: deviceId } = useParams();
    // Dichiarazione lista modelli
    const models = { vega: '#ffd60a', helios: '#00d4d8' };

    // Autenticazione
    const { accessToken } = useAuth();
    // Stato impostazioni originali
    const [originalSettings, setOriginalSettings] =
        useState<DeviceSettingsType | null>(null);
    // Stato dispositivo
    const [device, setDevice] = useState<Device | null>(null);
    // Stato colore icona
    const [iconColor, setIconColor] = useState('#00d68b');
    // Stato salvataggio
    const [saved, setSaved] = useState(true);
    // Stato errore
    const [error, setError] = useState('');
    // Stato caricamento
    const [loading, setLoading] = useState(true);
    // Stato impostazioni
    const [settings, setSettings] = useState<{
        mode: 'auto' | 'config' | 'safe';
        humMin: number;
        humMax: number;
        interval: number;
    } | null>(null);
    // Popupper
    const popupper = usePopup();

    // Caricamento pagina
    useEffect(() => {
        // Funzione caricamento dati
        const loadData = async () => {
            // Gestione errori
            try {
                // Controllo token
                if (accessToken) {
                    await getData(
                        setOriginalSettings,
                        accessToken,
                        'device_settings'
                    );
                    await getData(
                        setDevice,
                        accessToken,
                        'devices',
                        `id=${deviceId}`,
                        true
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

    // Controllo dispositivo
    useEffect(() => {
        // Controllo modello
        for (const [model, color] of Object.entries(models)) {
            if (device?.prototypeModel?.toLowerCase().includes(model)) {
                setIconColor(color);
            }
        }
    }, [device]);

    useEffect(() => {
        setSettings({
            mode: device?.mode || 'safe',
            humMin: originalSettings?.humMin || 0,
            humMax: originalSettings?.humMax || 0,
            interval: originalSettings?.interval || 0,
        });
    }, [device, originalSettings]);

    // Controllo salvataggio
    useEffect(() => {
        // Controllo impostazioni
        if (
            JSON.stringify(settings) !=
            JSON.stringify({
                mode: device?.mode,
                humMin: originalSettings?.humMin || 0,
                humMax: originalSettings?.humMax || 0,
                interval: originalSettings?.interval || 0,
            })
        ) {
            // Impostazione salvataggio
            setSaved(false);
        } else {
            // Impostazione salvataggio
            setSaved(true);
        }
    }, [settings]);

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
        <Page className="pt-[15vh]">
            {/* Barra superiore */}
            <TopBar url={`/dashboard/${deviceId}`}>
                <div className="flex items-center justify-center gap-1">
                    Impostazioni Device
                    <SaveIcon
                        className={`fill-current ${
                            saved ? 'text-success' : 'text-error'
                        } w-[20px] aspect-square`}
                    />
                </div>
            </TopBar>
            {/* Contenitore impostazioni */}
            <div className="flex flex-col items-center justify-center gap-7 w-full">
                {/* Contenitore info dispositivo */}
                <div className="flex gap-4 w-full items-center justify-center">
                    {/* Logo dispositivo */}
                    <div className="w-[70px] flex items-center justify-center aspect-square rounded-full bg-black">
                        <LogoIcon
                            style={{ color: iconColor }}
                            className="w-[65px] aspect-square fill-current"
                        />
                    </div>
                    {/* Info dispositivo */}
                    <div className="flex flex-col gap-5">
                        {/* Nome dispositivo */}
                        <h1 className="text-primary-text text-medium leading-1 font-bold flex items-center justify-center gap-1">
                            {device?.name || '-'}
                            {/* <EditIcon className="cursor-pointer w-[20px] text-primary-text aspect-square fill-current" /> */}
                        </h1>
                        {/* Modello dispositivo */}
                        <p className="text-primary-text text-small leading-1">
                            {device?.prototypeModel || '-'}
                        </p>
                    </div>
                </div>
                {/* Impostazione modalità */}
                <InputCont
                    inputType="select"
                    options={[
                        { value: 'auto', text: 'AUTO' },
                        { value: 'config', text: 'CONFIG' },
                        { value: 'safe', text: 'SAFE' },
                    ]}
                    value={settings?.mode}
                    setValue={(mode) =>
                        setSettings((prev) => (prev ? { ...prev, mode } : prev))
                    }
                >
                    Modalità:
                </InputCont>
                {settings?.mode == 'auto' ? (
                    <>
                        {/* Impostazione humMin */}
                        <InputCont
                            type="number"
                            value={settings?.humMin}
                            setValue={(humMin) =>
                                setSettings((prev) =>
                                    prev ? { ...prev, humMin } : prev
                                )
                            }
                        >
                            Soglia Umidità MIN:
                        </InputCont>
                        {/* Impostazione humMax */}
                        <InputCont
                            type="number"
                            value={settings?.humMax}
                            setValue={(humMax) =>
                                setSettings((prev) =>
                                    prev ? { ...prev, humMax } : prev
                                )
                            }
                        >
                            Soglia Umidità MAX:
                        </InputCont>
                        {/* Impostazione irrigationTime */}
                        <InputCont
                            type="number"
                            value={settings?.interval}
                            setValue={(interval) =>
                                setSettings((prev) =>
                                    prev ? { ...prev, interval } : prev
                                )
                            }
                        >
                            Intervallo Irrigazione:
                        </InputCont>
                    </>
                ) : (
                    ''
                )}
                {/* Separatore */}
                <Separator />
                {/* Info reset impostazioni */}
                <Info
                    onClick={() => {
                        if (!saved) {
                            popupper(
                                'RESET MODIFICHE',
                                'Procedi',
                                "Procedendo avverrà il reset delle modifiche, per cui tutte le modifiche non salvate andranno perse. L'azione è irreversibile",
                                'error',
                                () => {
                                    setSettings({
                                        mode: device?.mode || 'safe',
                                        humMin: originalSettings?.humMin || 0,
                                        humMax: originalSettings?.humMax || 0,
                                        interval:
                                            originalSettings?.interval || 0,
                                    });
                                }
                            );
                        }
                    }}
                    name="Reset Impostazioni"
                    icon={ResetIcon}
                    type="error"
                />
                {/* Info scollegamento dispositivo */}
                <Info
                    onClick={() => alert('SCOLLEGAMENTO')}
                    name="Scollega Device"
                    icon={LogoutIcon}
                    type="error"
                />
                {/* Info eliminazione dati */}
                <Info
                    onClick={() => alert('ELIMINAZIONE DATI')}
                    name="Elimina Dati"
                    icon={DeleteIcon}
                    type="error"
                />
                {/* Separatore */}
                <Separator />
                {/* Info salvataggio dati */}
                <Info
                    onClick={() => alert('SALVATAGGIO DATI')}
                    name="Salva"
                    icon={SaveIcon}
                    type="info"
                />
            </div>
            {/* Barra inferiore */}
            <BottomBar />
        </Page>
    );
}

// Esportazione pagina
export default DeviceSettings;
