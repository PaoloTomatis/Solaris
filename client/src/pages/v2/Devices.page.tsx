// Importazione moduli
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getData } from '../../utils/v2/apiCrud.utils';
import { useAuth } from '../../context/v2/Auth.context';
import { useNotifications } from '../../context/global/Notifications.context';
import { useWSConnection } from '../../context/v2/WSConnection.context';
import Page from '../../components/global/Page.comp';
import Device from '../../components/global/Device.comp';
import BottomBar from '../../components/global/BottomBar.comp';
import Loading from '../../components/global/Loading.comp';
import type { Device as DeviceType } from '../../utils/v2/type.utils';
// Importazione immagini
import AddIcon from '../../assets/icons/add.svg?react';

// Pagina dispositivi
function Devices() {
    // Tipo dispositivo completo
    interface ExtendedDeviceType extends DeviceType {
        status: boolean;
    }

    // Notificatore
    const notify = useNotifications();
    // Lista dispositivi
    const [devices, setDevices] = useState<ExtendedDeviceType[] | null>(null);
    // Autenticazione
    const { accessToken, user } = useAuth();
    // Stato caricamento
    const [loading, setLoading] = useState(true);
    // Stato errore
    const [error, setError] = useState('');
    // Iscrizione eventi
    const ws = useWSConnection();

    // Caricamento pagina
    useEffect(() => {
        const loadData = async () => {
            // Gestione errori
            try {
                // Controllo token e utente
                if (accessToken) {
                    await getData(
                        accessToken,
                        'devices',
                        setDevices,
                        `userId=${user?.id}`,
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

    // Controllo ws
    useEffect(() => {
        if (!ws) return;

        // Lista funzioni rimozione iscrizione
        const unsubscribes: (() => void)[] = [];

        // Controllo dispositivi
        if (devices) {
            // Iscrizione evento stato
            devices.forEach((device) => {
                unsubscribes.push(
                    ws.subscribe(device.id, 'status', (eventData: any) => {
                        // Impostazione dati
                        setDevices((prevDevices) =>
                            prevDevices
                                ? prevDevices.map((prevDevice) =>
                                      prevDevice.id == eventData?.deviceId
                                          ? { ...prevDevice, status: true }
                                          : prevDevice,
                                  )
                                : null,
                        );
                    }),
                );
            });
        }

        return () => unsubscribes.forEach((unsubscribe) => unsubscribe());
    }, [ws, devices]);

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
        <Page className="pt-7 gap-[25px] justify-start">
            {devices && devices.length > 0 ? (
                devices.map((deviceItem: ExtendedDeviceType) => {
                    return (
                        <Device
                            name={deviceItem.name}
                            prototypeModel={deviceItem.prototypeModel}
                            state={deviceItem.status}
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
