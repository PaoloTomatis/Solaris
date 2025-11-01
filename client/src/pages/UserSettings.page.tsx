// Importazione moduli
import { useEffect, useState } from 'react';
import Page from '../components/Page.comp';
import TopBar from '../components/TopBar.comp';
import BottomBar from '../components/BottomBar.comp';
import Info from '../components/Info.comp';
import InputCont from '../components/InputCont.comp';
import Separator from '../components/Separator.comp';
import Error from '../components/Error.comp';
import Loading from '../components/Loading.comp';
import type { UserSettings as UserSettingsType } from '../utils/type.utils';
// Importazione immagini
import ResetIcon from '../assets/icons/reset.svg?react';
import SaveIcon from '../assets/icons/save.svg?react';

// Pagina impostazione utente
function UserSettings() {
    // Stato impostazioni originarie
    const [originalSettings, setOriginalSettings] =
        useState<UserSettingsType | null>(null);
    // Stato salvataggio
    const [saved, setSaved] = useState(true);
    // Stato modalità
    const [styleMode, setStyleMode] = useState('');
    // Stato umidità minima
    const [units, setUnits] = useState('');
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
                userId: 'abc123',
                styleMode: 'dark',
                units: 'metric',
                updatedAt: new Date(),
                createdAt: new Date(),
            });
        } catch (error: any) {
            setError(error);
        } finally {
            setLoading(false);
        }
    }, []);

    // Controllo impostazioni originarie
    useEffect(() => {
        setStyleMode(originalSettings?.styleMode || 'light');
        setUnits(originalSettings?.units || 'metric');
    }, [originalSettings]);

    // Controllo salvataggio
    useEffect(() => {
        // Controllo impostazioni
        if (
            JSON.stringify({ styleMode, units }) !=
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
    }, [styleMode, units]);

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
                    value={styleMode}
                    setValue={setStyleMode}
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
                    value={units}
                    setValue={setUnits}
                >
                    Unità di Misura:
                </InputCont>
                {/* Separatore */}
                <Separator />
                {/* Info reset impostazioni */}
                <Info
                    onClick={() => {
                        if (!saved) {
                            //TODO Notifica conferma
                            setStyleMode(
                                originalSettings?.styleMode || 'light'
                            );
                            setUnits(originalSettings?.units || 'metric');
                        }
                    }}
                    name="Reset Impostazioni"
                    icon={ResetIcon}
                    type="error"
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
