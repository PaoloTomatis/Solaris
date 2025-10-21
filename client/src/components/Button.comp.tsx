// Importazione moduli
import type { ReactNode } from 'react';
import { Link } from 'react-router-dom';

// Componente pulsante
function Button({
    children,
    className,
    link,
    action,
}: {
    children: ReactNode;
    className?: string;
    link?: string;
    action?: () => void | Promise<void>;
}) {
    // Controllo link
    if (link) {
        return (
            <Link
                className={`${className} text-primary-text text-small rounded-[20px] border-[2px] border-black font-bold pb-1 pt-1 pl-2.5 pr-2.5 cursor-pointer transition-all`}
                to={link}
            >
                {children}
            </Link>
        );
    }

    return (
        <button
            className={`${className} text-primary-text text-small rounded-[20px] border-[2px] border-black font-bold pb-1 pt-1 pl-2.5 pr-2.5 cursor-pointer transition-all`}
            onClick={action}
        >
            {children}
        </button>
    );
}

// Esportazione componente
export default Button;
