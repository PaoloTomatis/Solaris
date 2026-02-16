// Importazione moduli
import React from 'react';
import Button from './Button.comp';
// Importazione immagini
import CloseIcon from '../../assets/icons/close.svg?react';

// Componente notifiche
function Popup({
    tit,
    desc,
    type,
    setVisible,
    children,
    className,
    onClick,
}: {
    tit: string;
    desc: string;
    type: 'info' | 'error' | 'warning' | 'success';
    setVisible: React.Dispatch<React.SetStateAction<boolean>>;
    children: React.ReactNode;
    className?: string;
    onClick?: () => void | Promise<void>;
}) {
    return (
        // Contenitore principale
        <div className="flex items-center justify-center w-screen h-screen fixed bottom-0 left-0 z-50 bg-black/40">
            <div className="flex flex-col rounded-3xl text-center items-center relative gap-[10px] justify-start bg-secondary-bg border-[2px] border-primary-text pb-6 pt-6 pl-2.5 pr-2.5 w-[400px] max-w-[90%] min-h-[25vh]">
                <h2
                    className={`text-medium font-bold ${
                        type == 'error'
                            ? 'text-error'
                            : type == 'warning'
                              ? 'text-warning'
                              : type == 'success'
                                ? 'text-success'
                                : 'text-info'
                    }`}
                >
                    {tit}
                </h2>
                <p className="text-xsmall leading-4 text-primary-text max-w-[350px] mb-3">
                    {desc}
                </p>
                <Button
                    onClick={() => {
                        onClick?.();
                        setVisible(false);
                    }}
                    type={type}
                    className={className}
                >
                    {children}
                </Button>
                <CloseIcon
                    onClick={() => setVisible(false)}
                    className="cursor-pointer fill-current text-primary-text w-[25px] aspect-square absolute top-4 right-4"
                />
            </div>
        </div>
    );
}

// Esportazione componente
export default Popup;
