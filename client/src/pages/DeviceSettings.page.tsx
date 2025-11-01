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
// Importazione immagini
import EditIcon from '../assets/icons/edit.svg?react';
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
    const [kInterval, setKInterval] = useState(0);
    // Stato errore
    const [error, setError] = useState('');
    // Stato caricamento
    const [loading, setLoading] = useState(true);

    // Caricamento pagina
    useEffect(() => {
        // Gestione errori
        try {
            setOriginalSettings({
                id: 'abc123',
                humMin: 25,
                humMax: 75,
                kInterval: 2.5,
                deviceId: 'abc123',
                updatedAt: new Date(),
                createdAt: new Date(),
            });
            setDevice({
                id: 'abc123',
                name: 'My Device 1',
                prototype: 'Solaris Vega',
                userId: 'abc123',
                mode: 'auto',
                activatedAt: new Date(),
                updatedAt: new Date(),
                createdAt: new Date(),
            });
        } catch (error: any) {
            setError(error);
        } finally {
            setLoading(false);
        }
    }, []);

    // Controllo dispositivo
    useEffect(() => {
        // Controllo modello
        for (const [model, color] of Object.entries(models)) {
            if (device?.prototype?.toLowerCase().includes(model)) {
                setIconColor(color);
            }
        }
    }, [device]);

    useEffect(() => {
        setMode(device?.mode || 'safe');
        setHumMin(originalSettings?.humMin || 0);
        setHumMax(originalSettings?.humMax || 0);
        setKInterval(originalSettings?.kInterval || 0);
    }, [device, originalSettings]);

    // Controllo salvataggio
    useEffect(() => {
        // Controllo impostazioni
        if (
            JSON.stringify({ mode, humMin, humMax, kInterval }) !=
            JSON.stringify({
                mode: device?.mode,
                humMin: originalSettings?.humMin,
                humMax: originalSettings?.humMax,
                kInterval: originalSettings?.kInterval,
            })
        ) {
            // Impostazione salvataggio
            setSaved(false);
        } else {
            // Impostazione salvataggio
            setSaved(true);
        }
    }, [mode, humMin, humMax, kInterval]);

    // Controllo errore
    if (error) {
        return <Error error={error} />;
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
                            <EditIcon className="cursor-pointer w-[20px] text-primary-text aspect-square fill-current" />
                        </h1>
                        {/* Modello dispositivo */}
                        <p className="text-primary-text text-small leading-1">
                            {device?.prototype || '-'}
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
                            value={kInterval}
                            setValue={setKInterval}
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
                            setKInterval(originalSettings?.kInterval || 0);
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
