// Importazione moduli
import Button from '../global/Button.comp';

// Componente versione dispositivo
function DeviceUpdate({
    firmwareVersion,
    channel,
    notes,
    date,
    onClick,
}: {
    firmwareVersion: string;
    channel: 'stable' | 'beta' | 'dev';
    notes?: string;
    date?: Date;
    onClick: (arg0: any) => void | Promise<void>;
}) {
    // Lista canali
    const channels = { stable: 'green', beta: 'yellow', dev: 'red' };
    return (
        // Contenitore principale
        <div className="flex flex-col items-center relative justify-center rounded-3xl bg-primary-bg border-[2px] border-primary-text pb-4 pt-1.5 pl-2.5 pr-2.5 w-[95%] max-w-[500px] min-h-[12vh]">
            {/* Contenitore testo */}
            <div className="flex items-center justify-center w-full py-2">
                <div className="flex items-end justify-center">
                    <p className="text-[3rem] font-bold text-primary-text">
                        {firmwareVersion}
                    </p>
                    <p
                        className="text-small font-semibold"
                        style={{ color: channels[channel] }}
                    >
                        {channel?.toUpperCase()}
                    </p>
                </div>
            </div>
            <div className="flex flex-col items-center justify-center gap-13 w-full py-2">
                {notes && (
                    <p className="text-primary-text text-small max-w-[90%]">
                        {notes?.slice(0, 400)}
                        {notes.length > 400 && '...'}
                    </p>
                )}
                <Button onClick={onClick}>Scarica sul Dispositivo</Button>
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
export default DeviceUpdate;
