// Importazione moduli
import { Link } from 'react-router-dom';
import Page from '../components/Page.comp';
import Device from '../components/Device.comp';
import BottomBar from '../components/BottomBar.comp';
// Importazione immagini
import AddIcon from '../assets/icons/add.svg?react';

// Pagina dispositivi
function Devices() {
    // Lista dispositivi
    const devicesList: {
        name: string;
        prototype: string;
        state: boolean;
        id: string;
    }[] = [
        {
            name: 'My Device 1',
            prototype: 'Solaris Vega',
            state: true,
            id: 'abc123',
        },
        {
            name: 'My Device 2',
            prototype: 'Solaris Helios',
            state: false,
            id: 'def456',
        },
    ];

    return (
        <Page className="pt-7 gap-[25px] justify-start">
            {devicesList.map((deviceItem) => {
                return (
                    <Device
                        name={deviceItem.name}
                        prototype={deviceItem.prototype}
                        state={deviceItem.state}
                        id={deviceItem.id}
                        key={deviceItem.id}
                    />
                );
            })}
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
