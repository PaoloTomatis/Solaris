// Importazione moduli
import { useState, useEffect } from 'react';
import { useAuth } from '../../context/v2/Auth.context';
import { useNotifications } from '../../context/global/Notifications.context';
import BottomBar from '../../components/global/BottomBar.comp';
import TopBar from '../../components/global/TopBar.comp';
import Page from '../../components/global/Page.comp';
import Select from '../../components/global/Select.comp';
import Button from '../../components/global/Button.comp';
import Input from '../../components/global/Input.comp';
import Textarea from '../../components/global/Textarea.comp';
import { postData } from '../../utils/v2/apiCrud.utils';
import Page404 from '../global/Page404.page';
import Loading from '../../components/global/Loading.comp';

// Pagina aggiornamenti dispositivo
function AdminDeviceUpdates() {
    // Autenticazione
    const { accessToken, user } = useAuth();
    // Notificatore
    const notify = useNotifications();
    // Stato errore
    const [error, setError] = useState('');
    // Stato caricamento
    const [loading, setLoading] = useState(false);
    // Stato tempo irrigazione
    const [firmwareVersion, setFirmwareVersion] = useState<{
        notes: string;
        prototypeModel: string;
        channel: string;
        mandatory: boolean;
        code: string;
        firmwareVersion: string;
    }>({
        notes: '',
        prototypeModel: '',
        channel: '',
        mandatory: false,
        code: '',
        firmwareVersion: '',
    });

    // Controllo errore
    useEffect(() => {
        if (error) {
            notify('ERRORE!', error, 'error', 3);
        }
    }, [error]);

    // Controllo caricamento
    if (loading) {
        return <Loading />;
    }

    // Controllo accesso admin
    if (user && user.role == 'admin') {
        // Pagina
        return (
            <Page className="pt-[15vh] gap-5">
                {/* Barra superiore */}
                <TopBar url={`/`}>Aggiornamenti Dispositivi (ADMIN)</TopBar>
                {/* Input versione */}
                <Input
                    type="text"
                    placeholder="Inserisci nome versione es. 1.2.3"
                    setValue={(v) =>
                        setFirmwareVersion((prev) => {
                            return { ...prev, firmwareVersion: v };
                        })
                    }
                    value={firmwareVersion.firmwareVersion}
                />
                {/* Input note */}
                <Textarea
                    placeholder="Inserisci note versione"
                    setValue={(v) =>
                        setFirmwareVersion((prev) => {
                            return { ...prev, notes: v };
                        })
                    }
                    value={firmwareVersion.notes}
                />
                {/* Input modello prototipo */}
                <Input
                    type="text"
                    placeholder="Inserisci modello prototipo"
                    setValue={(v) =>
                        setFirmwareVersion((prev) => {
                            return { ...prev, prototypeModel: v };
                        })
                    }
                    value={firmwareVersion.prototypeModel}
                />
                {/* Input canale */}
                <Select
                    options={[
                        { value: 'stable', text: 'Stabile' },
                        { value: 'beta', text: 'Beta' },
                        { value: 'dev', text: 'Sviluppo' },
                    ]}
                    setValue={(v) =>
                        setFirmwareVersion((prev) => {
                            return { ...prev, channel: v };
                        })
                    }
                    value={firmwareVersion.channel}
                />
                {/* Input canale */}
                <Select
                    options={[
                        { value: true, text: 'Obbligatorio' },
                        { value: false, text: 'Facoltativo' },
                    ]}
                    setValue={(v) =>
                        setFirmwareVersion((prev) => {
                            return { ...prev, mandatory: v };
                        })
                    }
                    value={firmwareVersion.mandatory}
                />
                {/* Input codice */}
                <Textarea
                    placeholder="Inserisci codice versione"
                    setValue={(v) =>
                        setFirmwareVersion((prev) => {
                            return { ...prev, code: v };
                        })
                    }
                    value={firmwareVersion.code}
                />
                {/* Pulsante invio */}
                <Button
                    onClick={async () => {
                        // Gestione errori
                        try {
                            // Controllo token
                            if (accessToken) {
                                await postData(
                                    'devices-versions',
                                    'api',
                                    accessToken,
                                    {
                                        ...firmwareVersion,
                                        mandatory: Boolean(
                                            firmwareVersion.mandatory,
                                        ),
                                    },
                                );
                                setFirmwareVersion({
                                    notes: '',
                                    prototypeModel: '',
                                    channel: '',
                                    mandatory: false,
                                    code: '',
                                    firmwareVersion: '',
                                });
                            }
                        } catch (error: any) {
                            setError(error.message);
                        } finally {
                            setLoading(false);
                        }
                    }}
                >
                    Pubblica Versione
                </Button>
                {/* Barra inferiore */}
                <BottomBar />
            </Page>
        );
    } else {
        return <Page404 />;
    }
}

// Esportazione pagina
export default AdminDeviceUpdates;
