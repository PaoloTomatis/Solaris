// Importazione moduli
import { useState, useEffect } from 'react';
import { patchData } from '../utils/apiCrud.utils';
import { useAuth } from '../context/Auth.context';
import { useNavigate } from 'react-router-dom';
import { useNotifications } from '../context/Notifications.context';
import Page from '../components/Page.comp';
import Input from '../components/Input.comp';
import Button from '../components/Button.comp';
import TopBar from '../components/TopBar.comp';
import BottomBar from '../components/BottomBar.comp';
import Loading from '../components/Loading.comp';

// Pagina registrazione dispositivi
function DeviceRegister() {
    // Navigatore
    const navigator = useNavigate();
    // Notificatore
    const notify = useNotifications();
    // Autenticazione
    const { accessToken, user } = useAuth();
    // Stato nome
    const [name, setName] = useState('');
    // Stato codice
    const [key, setKey] = useState('');
    // Stato caricamento
    const [loading, setLoading] = useState(false);
    // Stato errore
    const [error, setError] = useState('');

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
        // Contenitore pagina
        <Page className="justify-center">
            <TopBar url="/devices">Attivazione Device</TopBar>
            {/* Contenitore campi */}
            <div className="flex flex-col gap-[12px] border-primary-text border-[2px] bg-secondary-bg rounded-3xl px-4 py-6 items-center justify-center w-[90%] max-w-[350px]">
                {/* Titolo */}
                <h1 className="text-xlarge text-primary-text leading-5 font-bold">
                    Attiva Device🤖
                </h1>
                {/* Descrizione */}
                <p className="text-xsmall text-primary-text max-w-[300px] leading-4 mb-[20px]">
                    Inserisci il codice presente nella confezione del
                    dispositivo per legarlo al tuo account
                </p>
                {/* Input nome */}
                <Input
                    placeholder="Inserisci Nome Personalizzato"
                    value={name}
                    setValue={setName}
                />
                {/* Input codice */}
                <Input
                    placeholder="Inserisci Codice"
                    value={key}
                    setValue={setKey}
                />
                {/* Pulsante invio */}
                <Button
                    onClick={async () => {
                        // Gestione errori
                        try {
                            // Impostazione caricamento
                            setLoading(true);

                            // Controllo utente
                            if (user) {
                                await patchData(
                                    accessToken || '',
                                    `activate_device/${key}`,
                                    {
                                        name,
                                    }
                                );

                                navigator('/devices');
                            }
                        } catch (error: any) {
                            setError(error.message);
                        } finally {
                            setName('');
                            setKey('');
                            setLoading(false);
                        }
                    }}
                    className="mt-[10px] bg-secondary dark:bg-primary text-primary-bg"
                >
                    Attiva
                </Button>
            </div>
            <BottomBar />
        </Page>
    );
}

// Esportazione pagina
export default DeviceRegister;
