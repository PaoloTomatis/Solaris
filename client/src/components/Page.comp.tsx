// Importazione moduli
import type { ReactNode } from 'react';

// Componente pagina
function Page({
    className,
    children,
}: {
    className?: string;
    children?: ReactNode;
}) {
    return (
        <div
            className={`${className} w-full min-h-screen flex flex-col items-center bg-primary-bg pb-[15vh]`}
        >
            {children}
        </div>
    );
}

// Esportazione componente
export default Page;
