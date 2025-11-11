// Importazione moduli
import React from 'react';

// Componente dati
function Select({
    className,
    options,
    value,
    setValue,
}: {
    className?: string;
    options: { value: any; text: string | number }[];
    value: any;
    setValue: React.Dispatch<React.SetStateAction<any>>;
}) {
    return (
        <select
            className={`${className} cursor-pointer text-xsmall text-primary-text bg-primary-bg rounded-4xl border-[2px] px-2 py-1.5 w-[95%] max-w-max focus:border-secondary`}
            value={value}
            onChange={(e) => {
                setValue(e.target.value);
            }}
        >
            {options.map((opt, index) => {
                return (
                    <option key={index} value={opt.value}>
                        {opt.text}
                    </option>
                );
            })}
        </select>
    );
}

// Esportazione componente
export default Select;
