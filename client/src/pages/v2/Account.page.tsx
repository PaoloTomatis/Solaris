// Importazione moduli
import { useState, useEffect } from 'react';
import BottomBar from '../../components/global/BottomBar.comp';
import Info from '../../components/global/Info.comp';
import Page from '../../components/global/Page.comp';
import Separator from '../../components/global/Separator.comp';
import Loading from '../../components/global/Loading.comp';
import { useAuth } from '../../context/v2/Auth.context';
import { useNotifications } from '../../context/global/Notifications.context';
// Importazione icone
import SettingsIcon from '../assets/icons/settings.svg?react';
import CreditsIcon from '../assets/icons/credits.svg?react';
import DeviceIcon from '../assets/icons/dashboard.svg?react';
import PolicyIcon from '../assets/icons/policy.svg?react';
import LogoutIcon from '../assets/icons/logout.svg?react';
import DeleteIcon from '../assets/icons/delete.svg?react';

// Pagina account
function Account() {
    // Stato caricamento
    const [loading, setLoading] = useState(false);
    // Stato errore
    const [error, setError] = useState('');
    // Autenticazione
    const { user, logout, deleteAccount } = useAuth();
    // Notificatore
    const notify = useNotifications();

    // Controllo errore
    useEffect(() => {
        if (error) {
            notify('ERRORE!', error, 'error');
        }
    }, [error]);

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
                <Info url="/devices" name="Dispositivi" icon={DeviceIcon} />
                <Info
                    url="/warning?page=%2Faccount"
                    name="Privacy Policy"
                    icon={PolicyIcon}
                />
                <Info
                    url="/warning?page=%2Faccount"
                    name="Cookies Policy"
                    icon={PolicyIcon}
                />
                <Separator />
                <Info
                    onClick={async () => await logout(setLoading, setError)}
                    name="Logout"
                    icon={LogoutIcon}
                    type="error"
                />
                <Info
                    onClick={async () =>
                        await deleteAccount(setLoading, setError)
                    }
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
