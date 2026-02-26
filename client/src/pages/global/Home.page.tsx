// Importazione componenti
import Page from '../../components/global/Page.comp';
import BottomBar from '../../components/global/BottomBar.comp';
import Card from '../../components/global/Card.comp';
import Separator from '../../components/global/Separator.comp';
import ComponentCard from '../../components/global/ComponentCard.comp';
// Importazione immagini
import ClockIcon from '../../assets/icons/clock.svg?react';
import PlantIcon from '../../assets/icons/measurement.svg?react';
import ControlsIcon from '../../assets/icons/joystick.svg?react';
import NetworkIcon from '../../assets/icons/network-status.svg?react';
import AccessibilityIcon from '../../assets/icons/accessibility.svg?react';
import ResetIcon from '../../assets/icons/reset.svg?react';
import LinkIcon from '../../assets/icons/link.svg?react';
import AccountIcon from '../../assets/icons/account.svg?react';
import IrrigationIcon from '../../assets/icons/irrigation.svg?react';
import Esp32Img from '../../assets/images/esp32.png';
import PumpImg from '../../assets/images/pump.png';
import Dht22Img from '../../assets/images/dht22.png';
import BatteryImg from '../../assets/images/battery.png';
import SoilHumiditySensorImg from '../../assets/images/soilHumditySensor.png';
import PhotoresistorImg from '../../assets/images/photoresistor.png';

// Pagina home
function Home() {
    // Lista vantaggi
    const advantages = [
        {
            text: 'Non è un semplice time statico, ma un sistema adattivo completo',
            icon: ClockIcon,
        },
        {
            text: 'Limita gli sprechi di acqua ed elettricità con consumi minimi',
            icon: PlantIcon,
        },
        {
            text: "Offre un'automatizzazione completa per ogni tipo di esigenza",
            icon: ControlsIcon,
        },
        {
            text: 'Comprende un intero ecosistema a piena disposizione della pianta',
            icon: NetworkIcon,
        },
    ];

    // Lista componenti
    const components = [
        {
            name: 'ESP32',
            desc: 'Il cervello che gestisce tutti i sensori e gli attuatori: veloce e compatto',
            img: Esp32Img,
        },
        {
            name: 'Sensore Umidità Suolo',
            desc: "Sensore dell'umidità del suolo: preciso e non invasivo",
            img: SoilHumiditySensorImg,
        },
        {
            name: 'DHT22',
            desc: "Sensore di umidità e temperatura dell'aria",
            img: Dht22Img,
        },
        {
            name: 'Fotoresistenza',
            desc: "Sensore dell'esposizione solare: piccolo ed economico",
            img: PhotoresistorImg,
        },
        {
            name: 'Pompa',
            desc: "Protagonista dell'irrigazione automatica",
            img: PumpImg,
        },
        {
            name: 'Alimentazione',
            desc: 'Doppia alimentazione necessaria con batteria ricaricabile e cavo',
            img: BatteryImg,
        },
    ];

    // Lista algoritmo
    const algorithm = [
        {
            name: 'humIMax',
            desc: "Definisce l'umidità obiettivo dell'irrigazione",
        },
        {
            name: 'humIMin',
            desc: "Definisce l'umidità in cui è necessaria l'irrigazione",
        },
        {
            name: 'kInterval',
            desc: "Definisce il tempo necessario per aumentare l'umidità dell'1%",
        },
    ];

    // Lista obiettivi
    const goals = [
        {
            text: 'Accessibilità e interfaccia responsive per tablet e computer',
            icon: AccessibilityIcon,
        },
        {
            text: 'Miglioramento gestione irrigazione manuale',
            icon: IrrigationIcon,
        },
        {
            text: "Aggiornamenti OTA per dispositivi sempre all'ultima versione",
            icon: NetworkIcon,
        },
        {
            text: 'Calibrazione sensori per migliorare la qualità delle misurazioni',
            icon: ResetIcon,
        },
        {
            text: 'Pubblicazione Solaris online, aperto a chiunque',
            icon: LinkIcon,
        },
        {
            text: 'Integrazione sistemi AI per suggerimenti personalizzati',
            icon: AccountIcon,
        },
    ];

    return (
        <Page className="justify-center">
            {/* Sezione hero */}
            <div className="flex flex-col justify-center items-center gap-[20px] w-full h-screen">
                {/* Contenitore titolo */}
                <div className="flex flex-col justify-center items-center">
                    {/* Titolo hero */}
                    <h1 className="text-primary dark:text-secondary text-[4rem] text-center font-extrabold leading-15">
                        SOLARIS
                    </h1>
                    {/* Sottotitolo hero */}
                    <p className="text-medium font-semibold text-secondary max-w-[250px] text-center leading-5">
                        Tecnologia al servizio della Natura
                    </p>
                </div>
                {/* Descrizione hero */}
                <p className="text-small text-primary-text text-center w-[90%] max-w-[400px] leading-5">
                    Solaris è un sistema completo per la gestione di una serra
                    con obiettivo benessere delle coltivazioni con una completa
                    raccolta dei dati e l'automatizzazione delle irrigazioni
                </p>
            </div>
            <Separator className="my-[10vh]" />
            {/* Sezione vantaggi */}
            <div className="flex flex-col justify-center items-center gap-[20px] w-full">
                {/* Contenitore titolo */}
                <div className="flex flex-col justify-center items-center">
                    {/* Titolo */}
                    <h1 className="text-primary dark:text-secondary text-[3rem] text-center font-extrabold leading-15">
                        Vantaggi
                    </h1>
                    {/* Sottotitolo */}
                    <p className="text-medium font-semibold text-secondary max-w-[250px] text-center leading-5">
                        Solaris non è come tutti gli altri
                    </p>
                </div>
                {advantages.map((advantage, idx) => {
                    return idx % 2 == 0 ? (
                        <Card icon={advantage.icon} text={advantage.text} />
                    ) : (
                        <Card
                            icon={advantage.icon}
                            text={advantage.text}
                            reversed
                        />
                    );
                })}
            </div>
            <Separator className="my-[10vh]" />
            {/* Sezione dispositivo */}
            <div className="flex flex-col justify-center items-center gap-[20px] w-full">
                {/* Contenitore titolo */}
                <div className="flex flex-col justify-center items-center">
                    {/* Titolo */}
                    <h1 className="text-primary dark:text-secondary text-[3rem] text-center font-extrabold leading-15">
                        Solaris Vega
                    </h1>
                    {/* Sottotitolo */}
                    <p className="text-medium font-semibold text-secondary max-w-[250px] text-center leading-5">
                        Dispositivo completo e pensato per Coltivazioni
                        rigogliose
                    </p>
                </div>
                {components.map((component) => {
                    return (
                        <ComponentCard
                            name={component.name}
                            desc={component.desc}
                            img={component.img}
                        />
                    );
                })}
            </div>
            <Separator className="my-[10vh]" />
            {/* Sezione algoritmo */}
            <div className="flex flex-col justify-center items-center gap-[20px] w-full">
                {/* Contenitore titolo */}
                <div className="flex flex-col justify-center items-center">
                    {/* Titolo */}
                    <h1 className="text-primary dark:text-secondary text-[3rem] text-center font-extrabold leading-15">
                        Adattivo
                    </h1>
                    {/* Sottotitolo */}
                    <p className="text-medium font-semibold text-secondary max-w-[250px] text-center leading-5">
                        Solaris rispetta le esigenze delle Piante
                    </p>
                    {/* Descrizione */}
                    <div className="flex flex-col items-center justify-center gap-[10px] pt-[5vh] leading-5 text-center max-w-[85%]">
                        <p className="text-primary-text text-small max-w-[400px]">
                            La modalità automatica del dispositivo dispone di un{' '}
                            <span className="font-semibold">
                                calcolo automatico
                            </span>{' '}
                            delle soglie di irrigazione, in modo che la pianta
                            possa essere irrigata in base alle sue necessità
                        </p>
                        <p className="text-primary-text text-small max-w-[400px]">
                            L'algoritmo adatta ad ogni irrigazione le soglie in
                            modo che il{' '}
                            <span className="font-semibold">
                                sistema cresca con la pianta
                            </span>{' '}
                        </p>
                    </div>
                </div>
                {/* Descrizione */}
                <div className="flex flex-col justify-center items-center"></div>
                {algorithm.map((algorithmItem) => {
                    return (
                        <ComponentCard
                            name={algorithmItem.name}
                            desc={algorithmItem.desc}
                        />
                    );
                })}
            </div>
            <Separator className="my-[10vh]" />
            {/* Sezione obiettivi */}
            <div className="flex flex-col justify-center items-center gap-[20px] w-full">
                {/* Contenitore titolo */}
                <div className="flex flex-col justify-center items-center">
                    {/* Titolo */}
                    <h1 className="text-primary dark:text-secondary text-[3rem] text-center font-extrabold leading-15">
                        Obiettivi
                    </h1>
                    {/* Sottotitolo */}
                    <p className="text-medium font-semibold text-secondary max-w-[250px] text-center leading-5">
                        come ci impegniamo per il futuro di Solaris
                    </p>
                </div>
                {goals.map((goal, idx) => {
                    return idx % 2 == 0 ? (
                        <Card icon={goal.icon} text={goal.text} />
                    ) : (
                        <Card icon={goal.icon} text={goal.text} reversed />
                    );
                })}
            </div>
            <BottomBar />
        </Page>
    );
}

// Esportazione pagina
export default Home;
