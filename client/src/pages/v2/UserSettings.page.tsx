// Importazione moduli
import { useEffect, useState } from 'react';
import { useAuth } from '../../context/v2/Auth.context';
import { usePopup } from '../../context/global/Popup.context';
import { useNotifications } from '../../context/global/Notifications.context';
import { useNavigate } from 'react-router-dom';
import type { UserSettings as UserSettingsType } from '../../utils/v2/type.utils';
import { patchData } from '../../utils/v2/apiCrud.utils';
import Page from '../../components/global/Page.comp';
import TopBar from '../../components/global/TopBar.comp';
import BottomBar from '../../components/global/BottomBar.comp';
import Info from '../../components/global/Info.comp';
import InputCont from '../../components/global/InputCont.comp';
import Separator from '../../components/global/Separator.comp';
import Loading from '../../components/global/Loading.comp';
// Importazione immagini
import ResetIcon from '../../assets/icons/reset.svg?react';
import SaveIcon from '../../assets/icons/save.svg?react';

// Pagina impostazione utente
function UserSettings() {
    // Autenticazione
    const { accessToken } = useAuth();
    // Navigatore
    const navigator = useNavigate();
    // Notificatore
    const notify = useNotifications();
    // Popupper
    const popupper = usePopup();
    // Stato impostazioni originarie
    const { settings: originalSettings, setSettings: setOriginalSettings } =
        useAuth();
    // Stato impostazioni originarie
    const [settings, setSettings] = useState<UserSettingsType | null>(null);
    // Stato salvataggio
    const [saved, setSaved] = useState(true);
    // Stato errore
    const [error, setError] = useState('');
    // Stato caricamento
    const [loading, setLoading] = useState(false);

    // Controllo impostazioni originarie
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
            <TopBar url={`/account`}>
                <div className="flex items-center justify-center gap-1">
                    Impostazioni Utente
                    <SaveIcon
                        className={`fill-current ${
                            saved ? 'text-success' : 'text-error'
                        } w-[20px] aspect-square`}
                    />
                </div>
            </TopBar>
            {/* Contenitore impostazioni */}
            <div className="flex flex-col items-center justify-center gap-4 w-full">
                {/* Impostazione stile */}
                <InputCont
                    inputType="select"
                    options={[
                        { value: 'light', text: 'CHIARO' },
                        { value: 'dark', text: 'SCURO' },
                    ]}
                    value={settings?.styleMode}
                    setValue={(styleMode) =>
                        setSettings((prev) =>
                            prev ? { ...prev, styleMode } : prev,
                        )
                    }
                >
                    Stile HUB:
                </InputCont>
                {/* Impostazione unità */}
                <InputCont
                    inputType="select"
                    options={[
                        { value: 'metric', text: 'METRICO' },
                        { value: 'imperial', text: 'IMPERIALE' },
                    ]}
                    value={settings?.units}
                    setValue={(units) =>
                        setSettings((prev) =>
                            prev ? { ...prev, units } : prev,
                        )
                    }
                >
                    Unità di Misura:
                </InputCont>
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
                {/* Info salvataggio dati */}
                <Info
                    onClick={() => {
                        popupper(
                            'SALVATAGGIO DATI',
                            'Procedi',
                            "Procedendo avverrà il salvataggio dei dati del dispositivo, per cui tutte le impostazioni precedenti verranno sovrascritte. L'azione è irreversibile",
                            'info',
                            async () => {
                                // Impostazione caricamento
                                setLoading(true);

                                // Controllo token
                                if (accessToken) {
                                    // Gestione errori
                                    try {
                                        // Modifica impostazioni utente
                                        await patchData(
                                            accessToken,
                                            'me/user-settings',
                                            {
                                                styleMode: settings?.styleMode,
                                                units: settings?.units,
                                            },
                                        );
                                        navigator('/account');
                                        setOriginalSettings(settings);
                                    } catch (error: any) {
                                        setError(
                                            error?.message ||
                                                'Errore interno del server',
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
export default UserSettings;
