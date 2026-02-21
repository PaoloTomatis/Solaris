// Importazione moduli
import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import BottomBar from '../../components/global/BottomBar.comp';
import TopBar from '../../components/global/TopBar.comp';
import Page from '../../components/global/Page.comp';
import IrrigationComp from '../../components/v2/Irrigation.comp';
import Separator from '../../components/global/Separator.comp';
import Loading from '../../components/global/Loading.comp';
import type { Irrigations as IrrigationsType } from '../../utils/v2/type.utils';
import { getData } from '../../utils/v2/apiCrud.utils';
import { useAuth } from '../../context/v2/Auth.context';
import { useNotifications } from '../../context/global/Notifications.context';

// Pagina log
function Irrigations() {
    // Id device
    const { id: deviceId } = useParams();

    // Autenticazione
    const { accessToken } = useAuth();
    // Notificatore
    const notify = useNotifications();
    // Stato misurazioni
    const [irrigations, setIrrigations] = useState<IrrigationsType[] | null>(
        null,
    );
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
                        'irrigations',
                        setIrrigations,
                        `limit=50&deviceId=${deviceId}&sort=-irrigatedAt`,
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
            notify('ERRORE!', error, 'error', 3);
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
            <TopBar url={`/dashboard/${deviceId}`}>Irrigazioni</TopBar>
            {/* Contenitore log */}
            <div className="flex flex-col items-center justify-center gap-5 w-full">
                {irrigations && irrigations.length > 0 ? (
                    irrigations.map((irrigation) => (
                        <IrrigationComp
                            type={irrigation?.type}
                            temp={irrigation?.temp}
                            lum={irrigation?.lum?.toFixed(1)}
                            humE={irrigation?.humE}
                            humIBefore={irrigation?.humIBefore?.toFixed(1)}
                            humIAfter={irrigation?.humIAfter?.toFixed(1)}
                            interval={irrigation?.interval}
                            date={new Date(irrigation?.createdAt)}
                            key={irrigation?.id}
                        />
                    ))
                ) : (
                    <p className="text-small font-bold text-primary-text text-center">
                        Non sono presenti IRRIGAZIONI!
                    </p>
                )}
                {/* Contenitore separatore */}
                <div className="flex flex-col items-center justify-center w-full mt-10">
                    {/* Info separatore */}
                    <p className="text-primary-text text-xsmall">
                        Vengono visualizzate fino a 50 irrigazioni
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
export default Irrigations;
