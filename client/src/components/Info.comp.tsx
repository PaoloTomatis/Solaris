// Importazione moduli
import React from 'react';
import { Link } from 'react-router-dom';
// Importazione immagini
import ArrowIcon from '../assets/icons/arrow.svg?react';

// Componente barra navigazione
function Info({
    url,
    name,
    icon: Icon,
    info,
}: {
    url: string;
    name: string;
    icon: React.ComponentType<{ className?: string }>;
    info?: string;
}) {
    return (
        <Link
            className="flex items-center justify-center min-h-[10vh] w-[100%] pl-7 pr-7"
            to={url}
        >
            <div className="flex items-center justify-between w-[100%] max-w-[400px] min-h-[10vh]">
                <Icon className="fill-current text-primary-text w-[40px] aspect-square" />
                <h3 className="text-primary-text text-small font-bold">
                    {name}
                </h3>
                <div
                    style={{
                        justifyContent: info ? 'space-between' : 'end',
                    }}
                    className="flex items-center w-[20%]"
                >
                    {info ? (
                        <p className="text-info text-medium font-semibold">
                            {info}
                        </p>
                    ) : (
                        ''
                    )}
                    <ArrowIcon className="fill-current text-primary-text w-[30px] aspect-square" />
                </div>
            </div>
        </Link>
    );
}

// Esportazione componente
export default Info;
