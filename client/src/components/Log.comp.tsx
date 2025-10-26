// Importazione immagini
import InfoIcon from '../assets/icons/info.svg?react';
import WarningIcon from '../assets/icons/warning.svg?react';

// Componente log
function Log({
    tit,
    desc,
    type,
    date,
}: {
    tit: string;
    desc: string;
    type: string;
    date: Date;
}) {
    return (
        // Contenitore principale
        <div className="flex items-center relative justify-between rounded-3xl bg-secondary-bg border-[2px] border-black pb-4 pt-1.5 pl-2.5 pr-2.5 w-[95%] max-w-[500px] min-h-[12vh]">
            {/* Icona */}
            {type == 'log_error' ? (
                <WarningIcon className="fill-current text-error w-[90px] h-[90px] aspect-square" />
            ) : type == 'log_warning' ? (
                <WarningIcon className="fill-current text-warning w-[90px] h-[90px] aspect-square" />
            ) : (
                <InfoIcon className="fill-current text-info w-[90px] h-[90px] aspect-square" />
            )}
            {/* Contenitore testo */}
            <div className="flex flex-col items-start justify-around pl-4">
                <h3 className="text-small font-semibold">{tit}</h3>
                <p className="text-xsmall leading-4">{desc}</p>
            </div>
            {/* Contenitore data */}
            <p className="text-xxsmall absolute bottom-0.5 right-3">
                {`${date.getDate()}/${date.getMonth()}/${date.getFullYear()} - ${date.toLocaleTimeString()}`}
            </p>
        </div>
    );
}

// Esportazione componente
export default Log;
