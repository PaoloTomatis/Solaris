// Importazione moduli
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getData } from '../../utils/v1/apiCrud.utils';
import { useAuth } from '../../context/v1/Auth.context';
import { useNotifications } from '../../context/global/Notifications.context';
import Page from '../../components/global/Page.comp';
import Device from '../../components/global/Device.comp';
import BottomBar from '../../components/global/BottomBar.comp';
import Loading from '../../components/global/Loading.comp';
import type { Device as DeviceType } from '../../utils/v1/type.utils';
// Importazione immagini
import AddIcon from '../assets/icons/add.svg?react';

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

        // Apertura WebSocket
        const socket = new WebSocket(
            `${import.meta.env.VITE_WS_URL}?token=${accessToken}&authType=user`,
        );

        // Controllo messaggi
        socket.onmessage = (event) => {
            // Dichiarazione dati evento
            const eventData = JSON.parse(event.data);

            // Controllo tipo evento
            if (eventData.event == 'status') {
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
            }
        };

        // Controllo errori
        socket.onerror = () => {
            setError('Errore comunicazione o connessione a websocket!');
        };

        loadData();

        // Chiusura connesione
        return () => socket.close();
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
