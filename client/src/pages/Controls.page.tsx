// Importazione moduli
import { useParams } from 'react-router-dom';
import BottomBar from '../components/BottomBar.comp';
import TopBar from '../components/TopBar.comp';
import Page from '../components/Page.comp';
import Button from '../components/Button.comp';
import Input from '../components/Input.comp';
import { useState } from 'react';

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
            <div className="flex items-center justify-center w-full gap-2">
                <h2 className="text-primary-text text-medium">
                    Tempo Irrigazione:
                </h2>
                <Input
                    type="number"
                    value={irrigationTime}
                    setValue={setIrrigationTime}
                    className="max-w-max text-center"
                />
            </div>
            <div className="flex flex-col items-center justify-center w-full gap-2">
                <Button className="mt-[10px] bg-secondary text-black max-w-max">
                    Avvia Irrigazione
                </Button>
                <Button className="mt-[10px] bg-primary text-white max-w-max">
                    Salva Irrigazione
                </Button>
            </div>
            {/* Barra inferiore */}
            <BottomBar />
        </Page>
    );
}

// Esportazione pagina
export default Controls;
