// Importazione moduli
import React from 'react';

// Componente input
function Input({
    placeholder,
    className,
    type = 'text',
    value,
    setValue,
    error,
    setError,
}: {
    placeholder?: string;
    className?: string;
    type?: string;
    value: any;
    setValue: React.Dispatch<React.SetStateAction<any>>;
    error?: string;
    setError?: React.Dispatch<React.SetStateAction<string>>;
}) {
    return (
        <div className="w-[95%] max-w-[300px] flex flex-col items-center justify-center gap-0.5">
            <input
                type={type}
                placeholder={placeholder}
                className={`${className} text-xsmall text-primary-text bg-primary-bg rounded-4xl ${
                    error ? 'border-error' : 'border-primary-text'
                } border-[2px] px-2 py-1.5 w-full focus:border-secondary`}
                value={value}
                onChange={(e) => {
                    const val = e.target.value;
                    setValue(
                        type === 'number'
                            ? val === ''
                                ? ''
                                : Number(val)
                            : val
                    );
                    if (error && setError) {
                        setError('');
                    }
                }}
            />
            <p className="text-error text-xsmall max-w-[90%] leading-3">
                {error}
            </p>
        </div>
    );
}

// Esportazione componente
export default Input;
