// Importazione moduli
import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import BottomBar from '../components/BottomBar.comp';
import TopBar from '../components/TopBar.comp';
import Page from '../components/Page.comp';
import logTitle from '../utils/logTitle.utils';
import LogComp from '../components/Log.comp';
import Separator from '../components/Separator.comp';
import Error from '../components/Error.comp';
import Loading from '../components/Loading.comp';
import type { Data as LogType } from '../utils/type.utils';
import { getData } from '../utils/apiCrud.utils';
import { useAuth } from '../context/Auth.context';

// Pagina log
function Logs() {
    // Id device
    const { id: deviceId } = useParams();

    // Autenticazione
    const { accessToken } = useAuth();
    // Stato logs
    const [logs, setLogs] = useState<LogType[] | null>(null);
    // Stato caricamento
    const [loading, setLoading] = useState(true);
    // Stato errore
    const [error, setError] = useState('');

    // Caricamento pagina
    useEffect(() => {
        // Funziona caricamento dati
        const loadData = async () => {
            // Gestione errori
            try {
                // Controllo token
                if (accessToken) {
                    await getData(setLogs, accessToken, 'data');
                }
            } catch (error: any) {
                setError(error);
            } finally {
                setLoading(false);
            }
        };

        loadData();
    }, []);

    // Controllo errore
    if (error) {
        return <Error error={error} setError={setError} />;
    }

    // Controllo caricamento
    if (loading) {
        return <Loading />;
    }

    return (
        // Pagina
        <Page className="pt-[15vh]">
            {/* Barra superiore */}
            <TopBar url={`/dashboard/${deviceId}`}>Log</TopBar>
            {/* Contenitore log */}
            <div className="flex flex-col items-center justify-center gap-5 w-full">
                {logs && logs.length > 0 ? (
                    logs.map((log) => (
                        <LogComp
                            tit={logTitle(log.type)}
                            desc={log.desc}
                            type={log.type}
                            date={log.date}
                            read={log.read}
                            key={log.id}
                        />
                    ))
                ) : (
                    <p className="text-small font-bold text-primary-text text-center">
                        Non sono presenti LOG!
                    </p>
                )}
                {/* Contenitore separatore */}
                <div className="flex flex-col items-center justify-center w-full mt-10">
                    {/* Info separatore */}
                    <p className="text-primary-text text-xsmall">
                        Vengono visualizzati fino a 50 log
                    </p>
                    {/* Separatore */}
                    <Separator className="mt-0" />
                </div>
            </div>
            {/* Barra inferiore */}
            <BottomBar />
        </Page>
    );
}

// Esportazione pagina
export default Logs;
