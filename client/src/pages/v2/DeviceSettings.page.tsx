// Importazione moduli
import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useAuth } from '../../context/v2/Auth.context';
import {
    getData,
    getOneData,
    patchData,
    deleteData,
} from '../../utils/v2/apiCrud.utils';
import { usePopup } from '../../context/global/Popup.context';
import { useNotifications } from '../../context/global/Notifications.context';
import Page from '../../components/global/Page.comp';
import TopBar from '../../components/global/TopBar.comp';
import BottomBar from '../../components/global/BottomBar.comp';
import Info from '../../components/global/Info.comp';
import Separator from '../../components/global/Separator.comp';
import InputCont from '../../components/global/InputCont.comp';
import Loading from '../../components/global/Loading.comp';
import type {
    DeviceSettings as DeviceSettingsType,
    Device as DeviceType,
} from '../../utils/v2/type.utils';
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

    // Navigatore
    const navigator = useNavigate();
    // Autenticazione
    const { accessToken } = useAuth();
    // Notificatore
    const notify = useNotifications();
    // Popupper
    const popupper = usePopup();
    // Stato impostazioni originali
    const [originalSettings, setOriginalSettings] =
        useState<DeviceSettingsType | null>(null);
    // Stato colore icona
    const [iconColor, setIconColor] = useState('#00d68b');
    // Stato salvataggio
    const [saved, setSaved] = useState(true);
    // Stato dispositivo
    const [device, setDevice] = useState<DeviceType | null>(null);
    // Stato errore
    const [error, setError] = useState('');
    // Stato caricamento
    const [loading, setLoading] = useState(true);
    // Stato impostazioni
    const [settings, setSettings] = useState<DeviceSettingsType | null>(null);

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
                        `device-settings/${deviceId}`,
                        setOriginalSettings,
                    );
                    await getOneData(
                        accessToken,
                        `devices/${deviceId}`,
                        setDevice,
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
        setSettings(originalSettings);
    }, [originalSettings]);

    // Controllo salvataggio
    useEffect(() => {
        // Controllo impostazioni
        if (JSON.stringify(settings) != JSON.stringify(originalSettings)) {
            // Impostazione salvataggio
            setSaved(false);
        } else {
            // Impostazione salvataggio
            setSaved(true);
        }
    }, [settings]);

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
                            value={settings?.humIMin}
                            setValue={(humIMin) =>
                                setSettings((prev) =>
                                    prev ? { ...prev, humIMin } : prev,
                                )
                            }
                        >
                            Soglia Umidità MIN:
                        </InputCont>
                        {/* Impostazione humMax */}
                        <InputCont
                            type="number"
                            value={settings?.humIMax}
                            setValue={(humIMax) =>
                                setSettings((prev) =>
                                    prev ? { ...prev, humIMax } : prev,
                                )
                            }
                        >
                            Soglia Umidità MAX:
                        </InputCont>
                        {/* Impostazione irrigationTime */}
                        <InputCont
                            type="number"
                            value={settings?.kInterval}
                            setValue={(kInterval) =>
                                setSettings((prev) =>
                                    prev ? { ...prev, kInterval } : prev,
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
                                    setSettings(originalSettings);
                                },
                            );
                        }
                    }}
                    name="Reset Impostazioni"
                    icon={ResetIcon}
                    type={saved ? 'disabled' : 'error'}
                />
                {/* Info scollegamento dispositivo */}
                <Info
                    onClick={() => {
                        popupper(
                            'SCOLLEGAMENTO DEVICE',
                            'Procedi',
                            "Procedendo avverrà lo scollegamento del dispositivo, per cui tutti i dati verranno eliminati ed esso non verrà più associato al tuo account. L'azione è irreversibile",
                            'error',
                            async () => {
                                // Controllo token
                                if (accessToken) {
                                    // Gestione errori
                                    try {
                                        // Eliminazione notifiche
                                        await deleteData(
                                            accessToken,
                                            'notifications',
                                            `deviceId=${deviceId}`,
                                        );
                                        // Eliminazione misurazioni
                                        await deleteData(
                                            accessToken,
                                            'measurements',
                                            `deviceId=${deviceId}`,
                                        );
                                        // Eliminazione irrigazioni
                                        await deleteData(
                                            accessToken,
                                            'irrigations',
                                            `deviceId=${deviceId}`,
                                        );
                                        // Modifica dispositivo
                                        await patchData(
                                            accessToken,
                                            `devices/${deviceId}`,
                                            {
                                                userId: null,
                                            },
                                        );
                                        // Reindirizzamento
                                        navigator('/devices');
                                    } catch (error: any) {
                                        notify(
                                            'ERRORE',
                                            error?.message ||
                                                'Errore interno del server',
                                            'error',
                                        );
                                    }
                                }
                            },
                        );
                    }}
                    name="Scollega Device"
                    icon={LogoutIcon}
                    type="error"
                />
                {/* Info eliminazione dati */}
                <Info
                    onClick={() => {
                        popupper(
                            'ELIMINAZIONE DATI',
                            'Procedi',
                            "Procedendo avverrà la completa cancellazione dei dati del dispositivo, rendendoli irrecuperabili. L'azione è irreversibile",
                            'error',
                            async () => {
                                // Gestione errori
                                try {
                                    // Controllo token
                                    if (accessToken) {
                                        // Eliminazione notifiche
                                        await deleteData(
                                            accessToken,
                                            'notifications',
                                            `deviceId=${deviceId}`,
                                        );
                                        // Eliminazione misurazioni
                                        await deleteData(
                                            accessToken,
                                            'measurements',
                                            `deviceId=${deviceId}`,
                                        );
                                        // Eliminazione irrigazioni
                                        await deleteData(
                                            accessToken,
                                            'irrigations',
                                            `deviceId=${deviceId}`,
                                        );
                                    }
                                } catch (error: any) {
                                    notify(
                                        'ERRORE',
                                        error?.message ||
                                            'Errore interno del server',
                                        'error',
                                    );
                                }
                            },
                        );
                    }}
                    name="Elimina Dati"
                    icon={DeleteIcon}
                    type="error"
                />
                {/* Separatore */}
                <Separator />
                {/* Info salvataggio dati */}
                <Info
                    onClick={() => {
                        popupper(
                            'SALVATAGGIO DATI',
                            'Procedi',
                            "Procedendo avverrà il salvataggio dei dati del dispositivo, per cui tutte le impostazioni precedenti verranno sovrascritte. L'azione è irreversibile",
                            'info',
                            async () => {
                                // Controllo token
                                if (accessToken) {
                                    // Gestione errori
                                    try {
                                        // Modifica dispositivo
                                        await patchData(
                                            accessToken,
                                            `devices-settings/${deviceId}`,
                                            settings,
                                        );
                                        navigator(`/dashboard/${deviceId}`);
                                    } catch (error: any) {
                                        notify(
                                            'ERRORE',
                                            error?.message ||
                                                'Errore interno del server',
                                            'error',
                                        );
                                    }
                                }
                            },
                        );
                    }}
                    name="Salva"
                    icon={SaveIcon}
                    type={saved ? 'disabled' : 'info'}
                />
            </div>
            {/* Barra inferiore */}
            <BottomBar />
        </Page>
    );
}

// Esportazione pagina
export default DeviceSettings;
