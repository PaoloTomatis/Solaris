// Importazione moduli
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import Page from '../components/Page.comp';
import TopBar from '../components/TopBar.comp';
import BottomBar from '../components/BottomBar.comp';
import Info from '../components/Info.comp';
import Separator from '../components/Separator.comp';
import InputCont from '../components/InputCont.comp';
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

    // Dichiarazione impostazioni originarie
    const originalSettings = {
        mode: 'auto',
        humMin: 25,
        humMax: 75,
        irrigationTime: 120,
    };

    // Stato salvataggio
    const [saved, setSaved] = useState(true);
    // Stato modalità
    const [mode, setMode] = useState('');
    // Stato umidità minima
    const [humMin, setHumMin] = useState(0);
    // Stato umidità massima
    const [humMax, setHumMax] = useState(0);
    // Stato tempo irrigazione
    const [irrigationTime, setIrrigationTime] = useState(0);

    // Caricamento componente
    useEffect(() => {
        setMode(originalSettings.mode);
        setHumMin(originalSettings.humMin);
        setHumMax(originalSettings.humMax);
        setIrrigationTime(originalSettings.irrigationTime);
    }, []);

    // Controllo salvataggio
    useEffect(() => {
        // Controllo impostazioni
        if (
            JSON.stringify({ mode, humMin, humMax, irrigationTime }) !=
            JSON.stringify(originalSettings)
        ) {
            // Impostazione salvataggio
            setSaved(false);
        } else {
            // Impostazione salvataggio
            setSaved(true);
        }
    }, [mode, humMin, humMax, irrigationTime]);

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
                <InputCont type="number" value={humMin} setValue={setHumMin}>
                    Soglia Umidità MIN:
                </InputCont>
                <InputCont type="number" value={humMax} setValue={setHumMax}>
                    Soglia Umidità MAX:
                </InputCont>
                <InputCont
                    type="number"
                    value={irrigationTime}
                    setValue={setIrrigationTime}
                >
                    Intervallo Irrigazione:
                </InputCont>
                <Separator />
                <Info
                    onClick={() => alert('RESET IMPOSTAZIONI')}
                    name="Reset Impostazioni"
                    icon={ResetIcon}
                    type="error"
                />
                <Info
                    onClick={() => alert('SCOLLEGAMENTO')}
                    name="Scollega Device"
                    icon={LogoutIcon}
                    type="error"
                />
                <Info
                    onClick={() => alert('ELIMINAZIONE DATI')}
                    name="Elimina Dati"
                    icon={DeleteIcon}
                    type="error"
                />
                <Separator />
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
