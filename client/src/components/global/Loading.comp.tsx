// Importazione moduli
import { useEffect, useState } from 'react';
import Page from './Page.comp';
import BottomBar from './BottomBar.comp';

// Componente dati
function Loading() {
    // Stato visualizzazione testo
    const [show, setShow] = useState(false);

    // Caricamento componente
    useEffect(() => {
        // Timeout visualizzazione testo
        const timeoutId = setTimeout(() => setShow(true), 10000);

        // Disattivazione timeout
        return () => clearTimeout(timeoutId);
    }, []);

    return (
        // Pagina
        <Page className="justify-center">
            {/* Testo principale */}
            <p className="text-primary-text text-medium font-bold animate-pulse">
                Caricamento...
            </p>
            {/* Controllo visualizzazione testo */}
            {show && (
                // Testo secondario
                <p className="text-secondary-text text-small mt-3 max-w-[95%]">
                    Il caricamento sta durando più del previso, prova a
                    ricaricare la pagina!
                </p>
            )}
            {/* Barra inferiore */}
            <BottomBar />
        </Page>
    );
}

// Esportazione componente
export default Loading;
