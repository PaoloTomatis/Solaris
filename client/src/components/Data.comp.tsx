// Importazione moduli
import React from 'react';

// Componente dati
function Data({
    img: Img,
    dato,
}: {
    img: React.ComponentType<{ className?: string }>;
    dato: string | number;
}) {
    return (
        <div className="flex flex-col items-center justify-center rounded-3xl bg-secondary-bg border-[2px] border-primary-text pb-1.5 pt-1.5 pl-2.5 pr-2.5 aspect-square">
            <Img className="w-[50px] aspect-square fill-current text-decoration" />
            <p className="text-medium text-primary-text">{dato}</p>
        </div>
    );
}

// Esportazione componente
export default Data;
