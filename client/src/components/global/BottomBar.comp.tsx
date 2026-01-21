// Importazione moduli
import { useLocation, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
// Importazione immagini
import UserIcon from '../assets/icons/account.svg?react';
import AddIcon from '../assets/icons/add.svg?react';
import DashboardIcon from '../assets/icons/dashboard.svg?react';

// Componente barra navigazione
function BottomBar() {
    // Stato icona selezionata
    const [selected, setSelected] = useState('');

    // Navigatore
    const navigator = useNavigate();

    // Dichiarazione url corrente
    const { pathname } = useLocation();

    // Dichiarazione controlli path
    const pathnames = [
        {
            condition:
                pathname.includes('/devices') ||
                pathname.includes('/dashboard'),
            name: 'dashboard',
            url: '/devices',
        },
        {
            condition:
                pathname == '/privacy' ||
                pathname == '/cookies' ||
                pathname == '/credits' ||
                pathname == '/settings' ||
                pathname == '/account' ||
                pathname.includes('/auth'),
            name: 'account',
            url: '/account',
        },
    ];

    useEffect(() => {
        // Controllo url
        pathnames.forEach((url) => {
            if (url.condition) {
                setSelected(url.name);
            }
        });
    }, []);

    return (
        // Contenitore barra
        <div className="w-full bg-[#000] flex align-center justify-center fixed bottom-0 left-0 rounded-tl-4xl rounded-tr-4xl z-40 py-3">
            <div className="flex items-center justify-around bg-transparent max-w-[500px] w-[100%]">
                {/* Icona utente */}
                <UserIcon
                    className={`w-[25px] ${
                        selected == 'account' ? 'text-primary' : 'text-white'
                    } fill-current cursor-pointer transition-all hover:text-secondary`}
                    onClick={() => navigator('/account')}
                />
                {/* Icona aggiungi */}
                <div className="w-[45px] aspect-square rounded-full bg-secondary flex items-center justify-center cursor-pointer hover:scale-115 transition-all">
                    <AddIcon
                        className="w-[30px] text-black fill-current cursor-pointer"
                        onClick={() => navigator('/devices/add')}
                    />
                </div>
                {/* Icona dashboard */}
                <DashboardIcon
                    className={`w-[25px] ${
                        selected == 'dashboard' ? 'text-primary' : 'text-white'
                    } fill-current cursor-pointer transition-all hover:text-secondary`}
                    onClick={() => navigator('/devices')}
                />
            </div>
        </div>
    );
}

// Esportazione componente
export default BottomBar;
