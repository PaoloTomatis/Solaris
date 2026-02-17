// Importazione moduli
import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import BottomBar from '../../components/global/BottomBar.comp';
import TopBar from '../../components/global/TopBar.comp';
import Page from '../../components/global/Page.comp';
import MeasurementComp from '../../components/v2/Measurement.comp';
import Separator from '../../components/global/Separator.comp';
import Loading from '../../components/global/Loading.comp';
import type { Measurements as MeasurementsType } from '../../utils/v2/type.utils';
import { getData } from '../../utils/v2/apiCrud.utils';
import { useAuth } from '../../context/v2/Auth.context';
import { useNotifications } from '../../context/global/Notifications.context';

// Pagina log
function Measurements() {
    // Id device
    const { id: deviceId } = useParams();

    // Autenticazione
    const { accessToken } = useAuth();
    // Notificatore
    const notify = useNotifications();
    // Stato misurazioni
    const [measurements, setMeasurements] = useState<MeasurementsType[] | null>(
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
                        'measurements',
                        setMeasurements,
                        `limit=50&deviceId=${deviceId}&sort=-measuredAt`,
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
            <TopBar url={`/dashboard/${deviceId}`}>Misurazioni</TopBar>
            {/* Contenitore log */}
            <div className="flex flex-col items-center justify-center gap-5 w-full">
                {measurements && measurements.length > 0 ? (
                    measurements.map((measurement) => (
                        <MeasurementComp
                            temp={measurement?.temp}
                            lum={measurement?.lum?.toFixed(1)}
                            humE={measurement?.humE}
                            humI={measurement?.humI?.toFixed(1)}
                            date={new Date(measurement?.createdAt)}
                            key={measurement?.id}
                        />
                    ))
                ) : (
                    <p className="text-small font-bold text-primary-text text-center">
                        Non sono presenti MISURAZIONI!
                    </p>
                )}
                {/* Contenitore separatore */}
                <div className="flex flex-col items-center justify-center w-full mt-10">
                    {/* Info separatore */}
                    <p className="text-primary-text text-xsmall">
                        Vengono visualizzate fino a 50 misurazioni
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
export default Measurements;
