// Importazione moduli
import { useState } from 'react';
import { useParams } from 'react-router-dom';
import BottomBar from '../components/BottomBar.comp';
import TopBar from '../components/TopBar.comp';
import Page from '../components/Page.comp';
import Button from '../components/Button.comp';
import InputCont from '../components/InputCont.comp';
// Importazione immagini
import InfoIcon from '../assets/icons/info.svg?react';

// Pagina controlli
function Controls() {
    // Id device
    const { id: deviceId } = useParams();

    // Stato tempo irrigazione
    const [irrigationTime, setIrrigationTime] = useState(120);

    return (
        // Pagina
        <Page className="pt-[15vh] gap-5">
            {/* Barra superiore */}
            <TopBar url={`/dashboard/${deviceId}`}>Controlli Manuali</TopBar>
            {/* Contenitore input */}
            <InputCont
                type="number"
                value={irrigationTime}
                setValue={setIrrigationTime}
            >
                Tempo Irrigazione:
            </InputCont>
            {/* Pulsante */}
            <Button
                onClick={() => {
                    alert(`IRRIGAZIONE --> ${irrigationTime}`);
                    setIrrigationTime(120);
                }}
                className="mt-[10px] bg-primary max-w-max"
            >
                Avvia Irrigazione
            </Button>
            {/* Contenitore info */}
            <div className="flex items-center justify-center absolute bottom-[20vh] left-0 w-full gap-4">
                <InfoIcon className="fill-current text-info w-[30px] aspect-square" />
                <p className="text-primary-text text-xsmall max-w-[300px]">
                    L'irrigazione manuale servirà per poter calcolare le soglie
                    per la modalità automatica. Bisogna assolutamente evitare di
                    effettuare l'irrigazione se il terreno non è effettivamente
                    asciutto, rischiando di confondere il calcolo della
                    configurazione
                </p>
            </div>
            {/* Barra inferiore */}
            <BottomBar />
        </Page>
    );
}

// Esportazione pagina
export default Controls;
