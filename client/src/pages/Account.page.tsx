// Importazione moduli
import { useState, useEffect } from 'react';
import BottomBar from '../components/BottomBar.comp';
import Info from '../components/Info.comp';
import Page from '../components/Page.comp';
import Separator from '../components/Separator.comp';
import Error from '../components/Error.comp';
import Loading from '../components/Loading.comp';
import type { User } from '../utils/type.utils';
// Importazione icone
import SettingsIcon from '../assets/icons/settings.svg?react';
import CreditsIcon from '../assets/icons/credits.svg?react';
import DeviceIcon from '../assets/icons/dashboard.svg?react';
import PolicyIcon from '../assets/icons/policy.svg?react';
import LogoutIcon from '../assets/icons/logout.svg?react';
import DeleteIcon from '../assets/icons/delete.svg?react';

// Pagina account
function Account() {
    // Stato account
    const [user, setUser] = useState<User | null>(null);
    // Stato caricamento
    const [loading, setLoading] = useState(true);
    // Stato errore
    const [error, setError] = useState('');

    // Caricamento pagina
    useEffect(() => {
        // Gestione errori
        try {
            setUser({
                id: 'abc123',
                email: 'mario.rossi@gmail.com',
                role: 'user',
                updatedAt: new Date(),
                createdAt: new Date(),
            });
        } catch (error: any) {
            setError(error);
        } finally {
            setLoading(false);
        }
    }, []);

    // Controllo errore
    if (error) {
        return <Error error={error} />;
    }

    // Controllo caricamento
    if (loading) {
        return <Loading />;
    }

    return (
        <Page className="gap-[30px] pt-7">
            <div className="flex justify-center items-center gap-[20px]">
                <div className="bg-primary w-[80px] aspect-square rounded-full flex items-center justify-center">
                    <h3 className="text-white text-[2.5rem] font-bold">
                        {user?.email
                            ? `${user.email[0]}${user.email[1]}`.toUpperCase()
                            : '-'}
                    </h3>
                </div>
                <div className="flex flex-col items-start justify-center gap-[15px]">
                    <h1 className="text-primary-text font-bold text-medium leading-3">
                        {user?.email ? user.email : '-'}
                    </h1>
                </div>
            </div>
            <div className="flex flex-col items-center justify-center w-[100%]">
                <Info url="/settings" name="Impostazioni" icon={SettingsIcon} />
                <Info url="/credits" name="Crediti" icon={CreditsIcon} />
                <Info
                    url="/devices"
                    name="Dispositivi"
                    icon={DeviceIcon}
                    info="4"
                />
                <Info url="/warning" name="Privacy Policy" icon={PolicyIcon} />
                <Info url="/warning" name="Cookies Policy" icon={PolicyIcon} />
                <Separator />
                <Info
                    onClick={() => alert('LOGOUT')}
                    name="Logout"
                    icon={LogoutIcon}
                    type="error"
                />
                <Info
                    onClick={() => alert('ELIMINAZIONE')}
                    name="Elimina Account"
                    icon={DeleteIcon}
                    type="error"
                />
            </div>
            <BottomBar />
        </Page>
    );
}

// Esportazione pagina
export default Account;
