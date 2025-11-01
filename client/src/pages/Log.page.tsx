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

// Pagina log
function Log() {
    // Id device
    const { id: deviceId } = useParams();

    // Stato logs
    const [logs, setLogs] = useState<LogType[] | null>(null);
    // Stato caricamento
    const [loading, setLoading] = useState(true);
    // Stato errore
    const [error, setError] = useState('');

    // Caricamento pagina
    useEffect(() => {
        // Gestione errori
        try {
            setLogs([
                {
                    id: 'abc123',
                    desc: "Il dispositivo MY DEVICE 1 ha tentato l'irrigazione senza successo",
                    read: false,
                    type: 'log_error',
                    date: new Date(),
                    deviceId: 'abc123',
                    updatedAt: new Date(),
                    createdAt: new Date(),
                },
                {
                    id: 'def456',
                    desc: "Il dispositivo MY DEVICE 1 ha effettuato correttamente l'irrigazione",
                    read: false,
                    type: 'log_irrigation_auto',
                    date: new Date(),
                    deviceId: 'abc123',
                    updatedAt: new Date(),
                    createdAt: new Date(),
                },
                {
                    id: 'ghi789',
                    desc: "Il dispositivo MY DEVICE 1 ha rilevato un'umidità sotto la soglia",
                    read: true,
                    type: 'log_warning',
                    date: new Date(),
                    deviceId: 'abc123',
                    updatedAt: new Date(),
                    createdAt: new Date(),
                },
                {
                    id: 'lmn123',
                    desc: 'Il dispositivo MY DEVICE 1 cambiato modalità da manuale ad automatica',
                    read: true,
                    type: 'log_info',
                    date: new Date(),
                    deviceId: 'abc123',
                    updatedAt: new Date(),
                    createdAt: new Date(),
                },
                {
                    id: 'opq456',
                    desc: "Il dispositivo MY DEVICE 1 ha effettuato correttamente l'irrigazione manuale di 20s",
                    read: true,
                    type: 'log_irrigation_config',
                    date: new Date(),
                    deviceId: 'abc123',
                    updatedAt: new Date(),
                    createdAt: new Date(),
                },
            ]);
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
        // Pagina
        <Page className="pt-[15vh]">
            {/* Barra superiore */}
            <TopBar url={`/dashboard/${deviceId}`}>Log</TopBar>
            {/* Contenitore log */}
            <div className="flex flex-col items-center justify-center gap-5 w-full">
                {logs ? (
                    logs.map((log) => (
                        <LogComp
                            tit={logTitle(log.type)}
                            desc={log.desc}
                            type={log.type}
                            date={log.date}
                            read={log.read}
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
export default Log;
