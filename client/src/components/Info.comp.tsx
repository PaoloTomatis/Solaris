// Importazione moduli
import React from 'react';
import { Link } from 'react-router-dom';
// Importazione immagini
import ArrowIcon from '../assets/icons/arrow.svg?react';

// Componente info
function Info({
    url,
    name,
    icon: Icon,
    info,
    onClick,
    type = 'normal',
}: {
    url?: string;
    name: string;
    icon: React.ComponentType<{ className?: string }>;
    info?: string;
    onClick?: () => void | Promise<void>;
    type?: 'normal' | 'error' | 'info';
}) {
    if (url) {
        return (
            <Link
                className="cursor-pointer flex items-center justify-center min-h-[5vh] w-[100%] pl-7 pr-7 hover:scale-105 transition-all"
                to={url}
            >
                <div className="flex items-center justify-between w-[100%] max-w-[400px] min-h-[8vh]">
                    <Icon
                        className={`fill-current w-[30px] aspect-square ${
                            type == 'error'
                                ? 'text-error'
                                : type == 'info'
                                ? 'text-info'
                                : 'text-primary-text'
                        }`}
                    />
                    <h3
                        className={`text-small ${
                            type == 'error'
                                ? 'text-error'
                                : type == 'info'
                                ? 'text-info'
                                : 'text-primary-text'
                        }`}
                    >
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
                        <ArrowIcon
                            className={`fill-current text-primary-text w-[20px] aspect-square ${
                                type == 'error'
                                    ? 'text-error'
                                    : type == 'info'
                                    ? 'text-info'
                                    : 'text-primary-text'
                            }`}
                        />
                    </div>
                </div>
            </Link>
        );
    }

    return (
        <div
            className="cursor-pointer flex items-center justify-center min-h-[8vh] w-[100%] pl-7 pr-7 hover:scale-105 transition-all"
            onClick={onClick}
        >
            <div className="flex items-center justify-between w-[100%] max-w-[400px] min-h-[8vh]">
                <Icon
                    className={`fill-current w-[30px] aspect-square ${
                        type == 'error'
                            ? 'text-error'
                            : type == 'info'
                            ? 'text-info'
                            : 'text-primary-text'
                    }`}
                />
                <h3
                    className={`text-small ${
                        type == 'error'
                            ? 'text-error'
                            : type == 'info'
                            ? 'text-info'
                            : 'text-primary-text'
                    }`}
                >
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
                    <ArrowIcon
                        className={`fill-current w-[20px] aspect-square ${
                            type == 'error'
                                ? 'text-error'
                                : type == 'info'
                                ? 'text-info'
                                : 'text-primary-text'
                        }`}
                    />
                </div>
            </div>
        </div>
    );
}

// Esportazione componente
export default Info;
