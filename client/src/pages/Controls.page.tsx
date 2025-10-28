// Importazione moduli
import { useParams } from 'react-router-dom';
import BottomBar from '../components/BottomBar.comp';
import TopBar from '../components/TopBar.comp';
import Page from '../components/Page.comp';
import Button from '../components/Button.comp';
import Input from '../components/Input.comp';
import { useState } from 'react';
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
            <div className="flex items-center justify-center w-full gap-2">
                {/* Testo */}
                <h2 className="text-primary-text text-medium">
                    Tempo Irrigazione:
                </h2>
                {/* Input */}
                <Input
                    type="number"
                    value={irrigationTime}
                    setValue={setIrrigationTime}
                    className="max-w-max text-center"
                />
            </div>
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
