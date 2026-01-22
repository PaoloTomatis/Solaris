// Importazione moduli
import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useAuth } from '../../context/v2/Auth.context';
import { useNotifications } from '../../context/global/Notifications.context';
import BottomBar from '../../components/global/BottomBar.comp';
import TopBar from '../../components/global/TopBar.comp';
import Page from '../../components/global/Page.comp';
import Button from '../../components/global/Button.comp';
import InputCont from '../../components/global/InputCont.comp';
import Loading from '../../components/global/Loading.comp';
import { postData } from '../../utils/v2/apiCrud.utils';
// Importazione immagini
import InfoIcon from '../assets/icons/info.svg?react';

// Pagina controlli
function Controls() {
    // Id device
    const { id: deviceId } = useParams();
    // Autenticazione
    const { accessToken } = useAuth();
    // Notificatore
    const notify = useNotifications();
    // Stato errore
    const [error, setError] = useState('');
    // Stato caricamento
    const [loading, setLoading] = useState(false);
    // Stato tempo irrigazione
    const [irrigationTime, setIrrigationTime] = useState(120);

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
                onClick={async () => {
                    // Gestione errori
                    try {
                        // Controllo token
                        if (accessToken) {
                            await postData(
                                'irrigations/execute',
                                'api',
                                accessToken,
                                { interval: irrigationTime },
                            );
                        }
                    } catch (error: any) {
                        setError(error.message);
                    } finally {
                        setLoading(false);
                    }
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
                    per la modalità automatica. Si consiglia di effettuare
                    alcune prove con i controlli manuali per poi{' '}
                    <Link
                        className="font-semibold"
                        to={`/dashboard/${deviceId}/settings`}
                    >
                        eliminare completamente i dati
                    </Link>
                </p>
            </div>
            {/* Barra inferiore */}
            <BottomBar />
        </Page>
    );
}

// Esportazione pagina
export default Controls;
