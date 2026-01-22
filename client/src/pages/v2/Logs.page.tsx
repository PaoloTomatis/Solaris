// Importazione moduli
import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import BottomBar from '../../components/global/BottomBar.comp';
import TopBar from '../../components/global/TopBar.comp';
import Page from '../../components/global/Page.comp';
import logTitle from '../../utils/global/logTitle.utils';
import LogComp from '../../components/v2/Log.comp';
import Separator from '../../components/global/Separator.comp';
import Loading from '../../components/global/Loading.comp';
import type { Data as LogType } from '../../utils/v1/type.utils';
import { getData } from '../../utils/v2/apiCrud.utils';
import { useAuth } from '../../context/v2/Auth.context';
import { useNotifications } from '../../context/global/Notifications.context';

// Pagina log
function Logs() {
    // Id device
    const { id: deviceId } = useParams();

    // Autenticazione
    const { accessToken } = useAuth();
    // Notificatore
    const notify = useNotifications();
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
                    await getData(
                        accessToken,
                        'notifications',
                        setLogs,
                        `limit=50&deviceId=${deviceId}`,
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
            <TopBar url={`/dashboard/${deviceId}`}>Log</TopBar>
            {/* Contenitore log */}
            <div className="flex flex-col items-center justify-center gap-5 w-full">
                {logs && logs.length > 0 ? (
                    logs.map((log) => (
                        <LogComp
                            tit={logTitle(log.type)}
                            desc={log.desc}
                            type={log.type}
                            date={new Date(log.date)}
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
