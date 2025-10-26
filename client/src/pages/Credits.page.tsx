// Importazione moduli
import React from 'react';
import TopBar from '../components/TopBar.comp';
import Page from '../components/Page.comp';
import Credit from '../components/Credit.comp';
import Separator from '../components/Separator.comp';
// Importazione immagini
import AccountIcon from '../assets/icons/account.svg?react';
import AddIcon from '../assets/icons/add.svg?react';
import ArrowIcon from '../assets/icons/arrow.svg?react';
import CheckIcon from '../assets/icons/checkmark.svg?react';
import CloseIcon from '../assets/icons/close.svg?react';
import CreditsIcon from '../assets/icons/credits.svg?react';
import DashboardIcon from '../assets/icons/dashboard.svg?react';
import DeleteIcon from '../assets/icons/delete.svg?react';
import EditIcon from '../assets/icons/edit.svg?react';
import HumidityIcon from '../assets/icons/humidity.svg?react';
import InfoIcon from '../assets/icons/info.svg?react';
import ControlsIcon from '../assets/icons/joystick.svg?react';
import LinkIcon from '../assets/icons/link.svg?react';
import LogIcon from '../assets/icons/log.svg?react';
import LogoutIcon from '../assets/icons/logout.svg?react';
import LuminosityIcon from '../assets/icons/luminosity.svg?react';
import NetworkIcon from '../assets/icons/network-status.svg?react';
import NotificationsIcon from '../assets/icons/notifications.svg?react';
import PolicyIcon from '../assets/icons/policy.svg?react';
import ResetIcon from '../assets/icons/reset.svg?react';
import SaveIcon from '../assets/icons/save.svg?react';
import SettingsIcon from '../assets/icons/settings.svg?react';
import StatsIcon from '../assets/icons/statistics.svg?react';
import TemperatureIcon from '../assets/icons/temperature.svg?react';
import WarningIcon from '../assets/icons/warning.svg?react';

// Pagina crediti
function Credits() {
    // Lista crediti
    const creditsList: {
        name: string;
        img: React.ComponentType<{ className?: string }>;
        url: string;
    }[] = [
        { name: 'Account', img: AccountIcon, url: 'https://icons8.com/' },
        { name: 'Aggiungi', img: AddIcon, url: 'https://icons8.com/' },
        { name: 'Freccia', img: ArrowIcon, url: 'https://icons8.com/' },
        { name: 'Spunta', img: CheckIcon, url: 'https://icons8.com/' },
        { name: 'Chiusura', img: CloseIcon, url: 'https://icons8.com/' },
        { name: 'Crediti', img: CreditsIcon, url: 'https://icons8.com/' },
        { name: 'Dashboard', img: DashboardIcon, url: 'https://icons8.com/' },
        { name: 'Elimina', img: DeleteIcon, url: 'https://icons8.com/' },
        { name: 'Modifica', img: EditIcon, url: 'https://icons8.com/' },
        { name: 'Umidità', img: HumidityIcon, url: 'https://icons8.com/' },
        { name: 'Informazione', img: InfoIcon, url: 'https://icons8.com/' },
        { name: 'Controlli', img: ControlsIcon, url: 'https://icons8.com/' },
        { name: 'Link', img: LinkIcon, url: 'https://icons8.com/' },
        { name: 'Log', img: LogIcon, url: 'https://icons8.com/' },
        { name: 'Logout', img: LogoutIcon, url: 'https://icons8.com/' },
        { name: 'Luminosità', img: LuminosityIcon, url: 'https://icons8.com/' },
        {
            name: 'Notifiche',
            img: NotificationsIcon,
            url: 'https://icons8.com/',
        },
        { name: 'Policy', img: PolicyIcon, url: 'https://icons8.com/' },
        { name: 'Reset', img: ResetIcon, url: 'https://icons8.com/' },
        { name: 'Salvataggio', img: SaveIcon, url: 'https://icons8.com/' },
        { name: 'Connessione', img: NetworkIcon, url: 'https://icons8.com/' },
        { name: 'Impostazioni', img: SettingsIcon, url: 'https://icons8.com/' },
        { name: 'Statistiche', img: StatsIcon, url: 'https://icons8.com/' },
        {
            name: 'Temperatura',
            img: TemperatureIcon,
            url: 'https://icons8.com/',
        },
        { name: 'Avviso', img: WarningIcon, url: 'https://icons8.com/' },
    ];

    return (
        <Page className="pt-[15vh] gap-2.5">
            <TopBar name="Crediti" url="/account" />
            {creditsList.map((creditItem, index) => {
                return (
                    <React.Fragment key={index}>
                        <Credit
                            name={`Icona ${creditItem.name}`}
                            img={creditItem.img}
                            url={creditItem.url}
                        />
                        {index !== creditsList.length - 1 ? <Separator /> : ''}
                    </React.Fragment>
                );
            })}
        </Page>
    );
}

// Esportazione pagina
export default Credits;
