// Importazione moduli
import type { ReactNode } from 'react';
import Input from './Input.comp';

// Componente cotenitore input
function InputCont({
    value,
    setValue,
    type,
    children,
}: {
    value: any;
    setValue: React.Dispatch<React.SetStateAction<any>>;
    type?: string;
    children: ReactNode;
}) {
    return (
        // Contenitore input
        <div className="flex items-center justify-center w-full gap-4">
            {/* Testo */}
            <h2 className="text-primary-text text-small">{children}</h2>
            {/* Input */}
            <Input
                type={type}
                value={value}
                setValue={setValue}
                className="max-w-max text-xsmall text-center"
            />
        </div>
    );
}

// Esportazione componente
export default InputCont;
