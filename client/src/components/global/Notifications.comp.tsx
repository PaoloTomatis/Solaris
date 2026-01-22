// Importazione moduli
import React from 'react';
// Importazione immagini
import CloseIcon from '../../assets/icons/close.svg?react';

// Componente notifiche
function Notifications({
    tit,
    desc,
    type,
    setVisible,
}: {
    tit: string;
    desc: string;
    type: 'info' | 'error' | 'warning' | 'success';
    setVisible: React.Dispatch<React.SetStateAction<boolean>>;
}) {
    return (
        // Contenitore principale
        <div className="flex items-center justify-start bg-secondary-bg border-[2px] border-black pb-1.5 pt-1.5 pl-2.5 pr-2.5 w-screen min-h-[12vh] fixed bottom-0 left-0 z-50">
            <div className="flex items-center justify-between max-w-[500px] min-h-[12vh] pr-[2rem]">
                <div
                    className={`h-[10vh] w-[3px] rounded-2xl ${
                        type == 'error'
                            ? 'bg-error'
                            : type == 'warning'
                              ? 'bg-warning'
                              : type == 'success'
                                ? 'bg-success'
                                : 'bg-info'
                    }`}
                ></div>
                <div className="flex flex-col items-start justify-around pl-4">
                    <h2
                        className={`text-small font-bold ${
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
                    <p className="text-xsmall leading-4 text-primary-text">
                        {desc}
                    </p>
                </div>
                <CloseIcon
                    onClick={() => setVisible(false)}
                    className="cursor-pointer fill-current text-primary-text w-[35px] h-[35px] aspect-square absolute top-[50%] translate-y-[-50%] right-3"
                />
            </div>
        </div>
    );
}

// Esportazione componente
export default Notifications;
