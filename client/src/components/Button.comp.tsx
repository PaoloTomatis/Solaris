// Importazione moduli
import type { ReactNode } from 'react';
import { Link } from 'react-router-dom';

// Componente pulsante
function Button({
    children,
    className,
    type,
    link,
    onClick,
}: {
    children: ReactNode;
    className?: string;
    type?: 'info' | 'error' | 'warning' | 'success' | null;
    link?: string;
    onClick?: () => void | Promise<void>;
}) {
    // Controllo link
    if (link) {
        return (
            <Link
                className={`${className} ${
                    type == 'error'
                        ? 'bg-error'
                        : type == 'warning'
                        ? 'bg-warning'
                        : type == 'success'
                        ? 'bg-success'
                        : type == 'info'
                        ? 'bg-info'
                        : ''
                } hover:bg-black dark:hover:bg-white hover:text-white dark:hover:text-black text-primary-text text-small rounded-[20px] border-[2px] border-primary-text font-bold pb-1 pt-1 pl-2.5 pr-2.5 cursor-pointer transition-all`}
                to={link}
            >
                {children}
            </Link>
        );
    }

    return (
        <button
            className={`${className} ${
                type == 'error'
                    ? 'bg-error'
                    : type == 'warning'
                    ? 'bg-warning'
                    : type == 'success'
                    ? 'bg-success'
                    : type == 'info'
                    ? 'bg-info'
                    : ''
            } hover:bg-black dark:hover:bg-white hover:text-white dark:hover:text-black text-primary-text text-small rounded-[20px] border-[2px] border-primary-text font-bold pb-1 pt-1 pl-2.5 pr-2.5 cursor-pointer transition-all`}
            onClick={onClick}
        >
            {children}
        </button>
    );
}

// Esportazione componente
export default Button;
