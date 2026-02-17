// Importazione immagini
import HumidityIIcon from '../../assets/icons/humidityI.svg?react';
import HumidityEIcon from '../../assets/icons/humidityE.svg?react';
import TemperatureIcon from '../../assets/icons/temperature.svg?react';
import LuminosityIcon from '../../assets/icons/luminosity.svg?react';
import CheckmarkIcon from '../../assets/icons/checkmark.svg?react';
import SettingsIcon from '../../assets/icons/settings.svg?react';

// Componente misurazioni
function Irrigation({
    temp,
    lum,
    humE,
    humIBefore,
    humIAfter,
    interval,
    date,
    type,
}: {
    temp?: string | number;
    lum?: string | number;
    humE?: string | number;
    humIBefore?: string | number;
    humIAfter?: string | number;
    interval?: string | number;
    type?: 'auto' | 'config';
    date?: Date;
}) {
    return (
        // Contenitore principale
        <div className="flex items-center relative justify-start rounded-3xl bg-primary-bg border-[2px] border-primary-text pb-4 pt-1.5 pl-2.5 pr-2.5 w-[95%] max-w-[500px] min-h-[12vh]">
            {/* Contenitore testo */}
            <div className="flex items-center justify-center gap-13 w-full py-2">
                <div className="flex flex-col items-center justify-center">
                    <LuminosityIcon className="w-[35px] aspect-square fill-current text-decoration" />
                    <p className="text-small text-primary-text">{lum}%</p>
                </div>
                <div className="flex flex-col items-center justify-center">
                    <TemperatureIcon className="w-[35px] aspect-square fill-current text-decoration" />
                    <p className="text-small text-primary-text">{temp}°C</p>
                </div>
                <div className="flex flex-col items-center justify-center">
                    <HumidityIIcon className="w-[35px] aspect-square fill-current text-decoration" />
                    <p className="text-small text-primary-text">
                        {humIBefore}% {'-->'} {humIAfter}%
                    </p>
                </div>
                <div className="flex flex-col items-center justify-center">
                    <HumidityEIcon className="w-[35px] aspect-square fill-current text-decoration" />
                    <p className="text-small text-primary-text">{humE}%</p>
                </div>
                <div className="flex flex-col items-center justify-center">
                    <CheckmarkIcon className="w-[35px] aspect-square fill-current text-decoration" />
                    <p className="text-small text-primary-text">
                        {interval}sec
                    </p>
                </div>
                <div className="flex flex-col items-center justify-center">
                    <SettingsIcon className="w-[35px] aspect-square fill-current text-decoration" />
                    <p className="text-small text-primary-text">{type}</p>
                </div>
            </div>
            {/* Contenitore data */}
            <p className="text-xsmall text-primary-text absolute bottom-0.5 right-3">
                {`${date?.toLocaleDateString() || '-'} - ${
                    date?.toLocaleTimeString() || '-'
                }`}
            </p>
        </div>
    );
}

// Esportazione componente
export default Irrigation;
