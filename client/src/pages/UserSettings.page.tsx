// Importazione moduli
import { useEffect, useState } from 'react';
import { useAuth } from '../context/Auth.context';
import { usePopup } from '../context/Popup.context';
import { useNotifications } from '../context/Notifications.context';
import type { UserSettings as UserSettingsType } from '../utils/type.utils';
import { getData } from '../utils/apiCrud.utils';
import Page from '../components/Page.comp';
import TopBar from '../components/TopBar.comp';
import BottomBar from '../components/BottomBar.comp';
import Info from '../components/Info.comp';
import InputCont from '../components/InputCont.comp';
import Separator from '../components/Separator.comp';
import Loading from '../components/Loading.comp';
// Importazione immagini
import ResetIcon from '../assets/icons/reset.svg?react';
import SaveIcon from '../assets/icons/save.svg?react';

// Pagina impostazione utente
function UserSettings() {
    // Autenticazione
    const { accessToken } = useAuth();
    // Notificatore
    const notify = useNotifications();
    // Popupper
    const popupper = usePopup();
    // Stato impostazioni originarie
    const [originalSettings, setOriginalSettings] =
        useState<UserSettingsType | null>(null);
    // Stato impostazioni originarie
    const [settings, setSettings] = useState<UserSettingsType | null>(null);
    // Stato salvataggio
    const [saved, setSaved] = useState(true);
    // Stato errore
    const [error, setError] = useState('');
    // Stato caricamento
    const [loading, setLoading] = useState(true);

    // Caricamento pagina
    useEffect(() => {
        const loadData = async () => {
            // Gestione errori
            try {
                // Controllo token e utente
                if (accessToken) {
                    await getData(
                        setOriginalSettings,
                        accessToken,
                        'user_settings'
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

    // Controllo impostazioni originarie
    useEffect(() => {
        setSettings(originalSettings);
    }, [originalSettings]);

    // Controllo salvataggio
    useEffect(() => {
        // Controllo impostazioni
        if (
            JSON.stringify({
                styleMode: settings?.styleMode,
                units: settings?.units,
            }) !=
            JSON.stringify({
                styleMode: originalSettings?.styleMode,
                units: originalSettings?.units,
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
                            prev ? { ...prev, styleMode } : prev
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
                            prev ? { ...prev, units } : prev
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
                                }
                            );
                        }
                    }}
                    name="Reset Impostazioni"
                    icon={ResetIcon}
                    type={saved ? 'disabled' : 'error'}
                />
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
export default UserSettings;
