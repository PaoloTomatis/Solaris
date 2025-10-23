// Importazione moduli
import { useNavigate } from 'react-router-dom';
// Importazione immagini
import ArrowIcon from '../assets/icons/arrow.svg?react';

// Componente barra navigazione superiore
function TopBar({ name, url }: { name: string; url: string }) {
    // Navigatore
    const navigator = useNavigate();

    return (
        <div className="fixed top-0 left-0 w-full h-[5vh]">
            <ArrowIcon
                onClick={() => navigator(url)}
                className="cursor-pointer w-[20px] rotate-180 fill-current text-primary-text absolute top-[30px] left-[30px]"
            />
            <h1 className="text-primary-text text-medium top-[30px] left-[50%] translate-x-[-50%] w-min absolute font-bold">
                {name}
            </h1>
        </div>
    );
}

// Esportazione componente
export default TopBar;
