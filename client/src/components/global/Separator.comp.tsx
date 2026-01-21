// Componente separatore
function Separator({ className }: { className?: string }) {
    return (
        <div
            className={`${className} w-[80%] max-w-[350px] bg-primary-text h-[3px] my-6 rounded-2xl`}
        ></div>
    );
}

// Esportazione componente
export default Separator;
