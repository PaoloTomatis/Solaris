// Importazione moduli
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Page from '../components/Page.comp';
import Device from '../components/Device.comp';
import BottomBar from '../components/BottomBar.comp';
import Error from '../components/Error.comp';
import Loading from '../components/Loading.comp';
import type { Device as DeviceType } from '../utils/type.utils';
// Importazione immagini
import AddIcon from '../assets/icons/add.svg?react';

// Pagina dispositivi
function Devices() {
    // Lista dispositivi
    const [devices, setDevices] = useState<DeviceType[] | null>(null);

    // Stato caricamento
    const [loading, setLoading] = useState(true);
    // Stato errore
    const [error, setError] = useState('');

    // Caricamento pagina
    useEffect(() => {
        // Gestione errori
        try {
            setDevices([
                {
                    id: 'abc123',
                    name: 'My Device 1',
                    prototype: 'Solaris Vega',
                    userId: 'abc123',
                    mode: 'auto',
                    activatedAt: new Date(),
                    updatedAt: new Date(),
                    createdAt: new Date(),
                },
                {
                    id: 'def456',
                    name: 'My Device 2',
                    prototype: 'Solaris Helios',
                    userId: 'def456',
                    mode: 'auto',
                    activatedAt: new Date(),
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
        return <Error error={error} setError={setError} />;
    }

    // Controllo caricamento
    if (loading) {
        return <Loading />;
    }

    return (
        <Page className="pt-7 gap-[25px] justify-start">
            {devices ? (
                devices.map((deviceItem: DeviceType) => {
                    return (
                        <Device
                            name={deviceItem.name}
                            prototype={deviceItem.prototype}
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
