// Importazione moduli
import React from 'react';
// Importazione immagini
import LinkIcon from '../assets/icons/link.svg?react';

// Componente crediti
function Credit({
    img: Img,
    name,
    url,
}: {
    img: React.ComponentType<{ className?: string }>;
    name: string;
    url: string;
}) {
    return (
        // Contenitore principale
        <div
            className="flex items-center justify-between cursor-pointer w-full max-w-[400px]"
            onClick={() => window.open(url, '_blank', 'noreferrer')}
        >
            {/* Icona */}
            <Img className="w-[30px] aspect-square fill-current text-primary dark:text-secondary" />
            {/* Nome icona */}
            <p className="text-small text-primary-text ml-auto mr-[15px] text-end">
                {name}
            </p>
            {/* Icona reindirizzamento */}
            <LinkIcon className="w-[20px] aspect-square fill-current text-primary-text" />
        </div>
    );
}

// Esportazione componente
export default Credit;
