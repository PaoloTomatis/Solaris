// Importazione moduli
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
// Importazione immagini
import LogoIcon from '../../assets/images/logo.svg?react';
import SignalIcon from '../../assets/icons/network-status.svg?react';
import ArrowIcon from '../../assets/icons/arrow.svg?react';

// Componente dispositivo
function Device({
    prototypeModel,
    name,
    state,
    id,
}: {
    prototypeModel: string;
    name: string;
    state: boolean;
    id: string;
}) {
    // Stato colore icona
    const [iconColor, setIconColor] = useState('#00d68b');

    // Dichiarazione lista modelli
    const models = { vega: '#ffd60a', helios: '#00d4d8' };

    useEffect(() => {
        // Controllo modello
        for (const [model, color] of Object.entries(models)) {
            if (prototypeModel.toLowerCase().includes(model)) {
                setIconColor(color);
            }
        }
    }, []);

    return (
        <Link
            to={`/dashboard/${id}`}
            className="flex items-center justify-between rounded-3xl bg-secondary-bg border-[2px] border-primary-text py-1.5 px-2.5 w-[90%] max-w-[400px] min-h-[12vh]"
        >
            <div className="bg-primary-text rounded-full flex flex-col items-center justify-center w-[50px] h-[50px] aspect-square">
                <LogoIcon
                    className="stroke-current fill-none w-[45px] h-[45px] aspect-square"
                    style={{ color: iconColor }}
                />
            </div>
            <div className="flex flex-col justify-center">
                <h3 className="text-medium font-bold text-primary-text leading-6">
                    {name}
                </h3>
                <p className="text-xsmall text-primary-text">
                    {prototypeModel}
                </p>
            </div>
            <div className="flex items-center w-[20%] justify-between">
                <SignalIcon
                    className={`${
                        state ? 'text-success' : 'text-error'
                    } fill-current w-[30px]`}
                />
                <ArrowIcon className="w-[30px] fill-current text-primary-text" />
            </div>
        </Link>
    );
}

// Esportazione componente
export default Device;
