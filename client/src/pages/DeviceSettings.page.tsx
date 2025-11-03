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
    // Stato modalità
    const [mode, setMode] = useState('');
    // Stato umidità minima
    const [humMin, setHumMin] = useState(0);
    // Stato umidità massima
    const [humMax, setHumMax] = useState(0);
    // Stato tempo irrigazione
    const [interval, setInterval] = useState(0);
    // Stato errore
    const [error, setError] = useState('');
    // Stato caricamento
    const [loading, setLoading] = useState(true);

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
        setMode(device?.mode || 'safe');
        setHumMin(originalSettings?.humMin || 0);
        setHumMax(originalSettings?.humMax || 0);
        setInterval(originalSettings?.interval || 0);
    }, [device, originalSettings]);

    // Controllo salvataggio
    useEffect(() => {
        // Controllo impostazioni
        if (
            JSON.stringify({ mode, humMin, humMax, interval }) !=
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
    }, [mode, humMin, humMax, interval]);

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
                    value={mode}
                    setValue={setMode}
                >
                    Modalità:
                </InputCont>
                {mode == 'auto' ? (
                    <>
                        {/* Impostazione humMin */}
                        <InputCont
                            type="number"
                            value={humMin}
                            setValue={setHumMin}
                        >
                            Soglia Umidità MIN:
                        </InputCont>
                        {/* Impostazione humMax */}
                        <InputCont
                            type="number"
                            value={humMax}
                            setValue={setHumMax}
                        >
                            Soglia Umidità MAX:
                        </InputCont>
                        {/* Impostazione irrigationTime */}
                        <InputCont
                            type="number"
                            value={interval}
                            setValue={setInterval}
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
                            //TODO Notifica conferma
                            setHumMax(originalSettings?.humMax || 0);
                            setHumMin(originalSettings?.humMin || 0);
                            setInterval(originalSettings?.interval || 0);
                            setMode(device?.mode || 'safe');
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
