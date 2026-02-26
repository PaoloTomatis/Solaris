// Importazione moduli
import React from 'react';

// Componente card
function Card({
    text,
    icon: Icon,
    reversed,
}: {
    text: string;
    icon: React.ComponentType<{ className?: string }>;
    reversed?: boolean;
}) {
    return (
        <div className="flex items-center rounded-3xl bg-primary-bg border-[2px] border-primary-text py-4 px-2.5 w-[85%] max-w-[500px] max-h-[100px] h-[20vh] justify-center">
            <div
                className={`flex items-center justify-between w-[90%] max-w-[400px] min-h-[8vh] ${reversed ? 'flex-row-reverse' : 'flex-row'}`}
            >
                <Icon className="fill-current w-[20%] aspect-square text-secondary" />
                <p
                    className={`text-primary-text text-small leading-5 w-[70%] ${reversed ? 'text-left' : 'text-right'}`}
                >
                    {text}
                </p>
            </div>
        </div>
    );
}

// Esportazione componente
export default Card;
