// Importazione moduli
import { useParams } from 'react-router-dom';
import { useState, useEffect } from 'react';
import Page from '../components/Page.comp';
import TopBar from '../components/TopBar.comp';
import BottomBar from '../components/BottomBar.comp';
import Loading from '../components/Loading.comp';
import Error from '../components/Error.comp';

// Pagina statistiche
function Stats() {
    // Id device
    const { id: deviceId } = useParams();

    // Stato caricamento
    const [loading, setLoading] = useState(true);
    // Stato errore
    const [error, setError] = useState('');

    // Caricamento pagina
    useEffect(() => {
        // Gestione errori
        try {
        } catch (error: any) {
            setError(error);
        } finally {
            setLoading(false);
        }
    }, []);

    // Controllo errore
    if (error) {
        return <Error error={error} />;
    }

    // Controllo caricamento
    if (loading) {
        return <Loading />;
    }

    return (
        <Page className="justify-center gap-1.5">
            <TopBar url={`/dashboard/${deviceId}`}>Statistiche</TopBar>
            <h1 className="text-primary-text text-medium font-bold text-center">
                FUNZIONALITÀ in via di SVILUPPO
            </h1>
            <p className="text-secondary-text text-small max-w-[400px] w-[95%] text-center">
                Il nostro Team si sta prendendo cura per la fioritura di questa
                funzionalità🌼
            </p>
            <BottomBar />
        </Page>
    );
}

// Esportazione pagina
export default Stats;
