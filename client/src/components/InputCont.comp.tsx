// Importazione moduli
import type { ReactNode } from 'react';
import Input from './Input.comp';
import Select from './Select.comp';

// Componente cotenitore input
function InputCont({
    value,
    setValue,
    type,
    children,
    inputType = 'input',
    placeholder,
    options,
}: {
    value: any;
    setValue: React.Dispatch<React.SetStateAction<any>>;
    type?: string;
    placeholder?: string;
    inputType?: 'input' | 'select';
    children: ReactNode;
    options?: { value: any; text: string | number }[];
}) {
    return (
        // Contenitore input
        <div className="flex items-center justify-center w-full gap-4">
            {/* Testo */}
            <h2 className="text-primary-text text-small">{children}</h2>
            {/* Input */}
            {inputType == 'select' && options ? (
                <Select value={value} setValue={setValue} options={options} />
            ) : (
                <Input
                    type={type}
                    value={value}
                    setValue={setValue}
                    className="max-w-max text-xsmall text-center"
                    placeholder={placeholder}
                />
            )}
        </div>
    );
}

// Esportazione componente
export default InputCont;
