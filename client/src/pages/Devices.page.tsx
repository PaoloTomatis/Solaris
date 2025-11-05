// Importazione moduli
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getData } from '../utils/apiCrud.utils';
import { useAuth } from '../context/Auth.context';
import { useNotifications } from '../context/Notifications.context';
import Page from '../components/Page.comp';
import Device from '../components/Device.comp';
import BottomBar from '../components/BottomBar.comp';
import Loading from '../components/Loading.comp';
import type { Device as DeviceType } from '../utils/type.utils';
// Importazione immagini
import AddIcon from '../assets/icons/add.svg?react';

// Pagina dispositivi
function Devices() {
    // Notificatore
    const notify = useNotifications();
    // Lista dispositivi
    const [devices, setDevices] = useState<DeviceType[] | null>(null);
    // Autenticazione
    const { accessToken } = useAuth();
    // Stato caricamento
    const [loading, setLoading] = useState(true);
    // Stato errore
    const [error, setError] = useState('');

    // Caricamento pagina
    useEffect(() => {
        const loadData = async () => {
            // Gestione errori
            try {
                // Controllo token e utente
                if (accessToken) {
                    await getData(setDevices, accessToken, 'devices');
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
        <Page className="pt-7 gap-[25px] justify-start">
            {devices && devices.length > 0 ? (
                devices.map((deviceItem: DeviceType) => {
                    return (
                        <Device
                            name={deviceItem.name}
                            prototypeModel={deviceItem.prototypeModel}
                            state={true}
                            id={deviceItem.id}
                            key={deviceItem.id}
                        />
                    );
                })
            ) : (
                <p className="text-small font-bold text-primary-text text-center">
                    Non sono presenti DISPOSITIVI!
                </p>
            )}
            <Link
                to="/devices/add"
                className="flex items-center justify-center mt-[15px] rounded-3xl bg-secondary-bg border-[2px] border-primary-text py-1.5 px-2.5 w-[100%] max-w-[100px] cursor-pointer"
            >
                <AddIcon className="fill-current text-primary-text w-[30px] aspect-square" />
            </Link>
            <BottomBar />
        </Page>
    );
}

// Esportazione pagina
export default Devices;
