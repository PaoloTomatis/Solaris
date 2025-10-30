// Importazione moduli
import { useParams } from 'react-router-dom';
import BottomBar from '../components/BottomBar.comp';
import TopBar from '../components/TopBar.comp';
import Page from '../components/Page.comp';
import logTitle from '../utils/logTitle.utils';
import LogComp from '../components/Log.comp';
import Separator from '../components/Separator.comp';

// Pagina log
function Log() {
    // Id device
    const { id: deviceId } = useParams();

    // Log
    const logs = [
        {
            desc: "Il dispositivo MY DEVICE 1 ha tentato l'irrigazione senza successo",
            type: 'log_error',
            date: new Date(),
            read: false,
        },
        {
            desc: "Il dispositivo MY DEVICE 1 ha effettuato correttamente l'irrigazione",
            type: 'irrigation_auto',
            date: new Date(),
            read: false,
        },
        {
            desc: "Il dispositivo MY DEVICE 1 ha rilevato un'umidità sotto la soglia",
            type: 'log_warning',
            date: new Date(),
            read: true,
        },
        {
            desc: 'Il dispositivo MY DEVICE 1 cambiato modalità da manuale ad automatica',
            type: 'log_info',
            date: new Date(),
            read: true,
        },
        {
            desc: "Il dispositivo MY DEVICE 1 ha effettuato correttamente l'irrigazione manuale di 20s",
            type: 'irrigation_config',
            date: new Date(),
            read: true,
        },
    ];

    return (
        // Pagina
        <Page className="pt-[15vh]">
            {/* Barra superiore */}
            <TopBar url={`/dashboard/${deviceId}`}>Log</TopBar>
            {/* Contenitore log */}
            <div className="flex flex-col items-center justify-center gap-5 w-full">
                {logs.map((log) => (
                    <LogComp
                        tit={logTitle(log.type)}
                        desc={log.desc}
                        type={log.type}
                        date={log.date}
                        read={log.read}
                    />
                ))}
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
