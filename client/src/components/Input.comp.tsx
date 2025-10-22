// Importazione moduli
import React from 'react';

// Componente input
function Input({
    placeholder,
    className,
    type = 'text',
    value,
    setValue,
}: {
    placeholder?: string;
    className?: string;
    type?: string;
    value: string;
    setValue: React.Dispatch<React.SetStateAction<string>>;
}) {
    return (
        <input
            type={type}
            placeholder={placeholder}
            className={`${className} text-xsmall text-secondary-text bg-primary-bg rounded-4xl border-[2px] px-2 py-1.5 w-[95%] max-w-[300px] focus:border-secondary`}
            value={value}
            onChange={(e) => setValue(e.target.value)}
        />
    );
}

// Esportazione componente
export default Input;
