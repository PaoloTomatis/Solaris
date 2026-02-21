// Importazione moduli
import { useState, useEffect } from 'react';
import { useParams, Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/v2/Auth.context';
import Input from '../../components/global/Input.comp';
import Button from '../../components/global/Button.comp';
import BottomBar from '../../components/global/BottomBar.comp';
import Page from '../../components/global/Page.comp';
import Loading from '../../components/global/Loading.comp';
import { useNotifications } from '../../context/global/Notifications.context';

// Pagina autenticazione
function Auth() {
    // Autenticazione
    const { login, register } = useAuth();

    // Pagina
    const location = useLocation();
    const searchParams = new URLSearchParams(location.search);
    const page = searchParams.get('page');

    // Navigatore
    const navigator = useNavigate();
    // Stato email
    const [email, setEmail] = useState({ text: '', error: '' });
    // Stato password
    const [password, setPassword] = useState({ text: '', error: '' });
    // Stato caricamento
    const [loading, setLoading] = useState(false);
    // Stato errore
    const [error, setError] = useState('');
    // Tipo autenticazione
    const { type } = useParams();
    // Notificatore
    const notify = useNotifications();

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

    return (
        // Contenitore pagina
        <Page className="justify-center">
            {/* Contenitore campi */}
            <div className="flex flex-col gap-[12px] border-primary-text border-[2px] bg-secondary-bg rounded-3xl px-4 py-6 items-center justify-center w-[90%] max-w-[350px]">
                {type == 'register' ? (
                    <>
                        {/* Titolo */}
                        <h1 className="text-xlarge text-primary-text leading-5 font-bold">
                            Benvenuto!👋
                        </h1>
                        {/* Descrizione */}
                        <p className="text-xsmall text-primary-text max-w-[300px] leading-4 mb-[20px]">
                            Crea il tuo account e inizia a piantare i frutti del
                            tuo futuro
                        </p>
                        {/* Input email */}
                        <Input
                            placeholder="Inserisci l'Email"
                            value={email.text}
                            setValue={(text) => setEmail({ ...email, text })}
                            error={email.error}
                            setError={(error) => setEmail({ ...email, error })}
                        />
                        {/* Input password */}
                        <Input
                            placeholder="Inserisci la Password"
                            value={password.text}
                            setValue={(text) =>
                                setPassword({ ...password, text })
                            }
                            type="password"
                            error={password.error}
                            setError={(error) =>
                                setPassword({ ...password, error })
                            }
                        />
                        {/* Pulsante invio */}
                        <Button
                            onClick={async () => {
                                if (
                                    !/^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/.test(
                                        email.text,
                                    )
                                ) {
                                    setEmail({
                                        ...email,
                                        error: "L'email deve essere formata nome@domin.io",
                                    });
                                }

                                if (
                                    !/^(?=.*\d)(?=.*[^a-zA-Z0-9]).{8,255}$/.test(
                                        password.text,
                                    )
                                ) {
                                    setPassword({
                                        ...password,
                                        error: 'La password deve contenere 8 caratteri di cui uno speciale e un numero',
                                    });
                                } else {
                                    await register(
                                        email.text,
                                        password.text,
                                        setLoading,
                                        setError,
                                    );
                                    navigator(
                                        `/auth/login${
                                            page
                                                ? `?page=${encodeURIComponent(
                                                      page,
                                                  )}`
                                                : ''
                                        }`,
                                    );
                                    setEmail({ ...email, text: '' });
                                    setPassword({ ...password, text: '' });
                                }
                            }}
                            className="mt-[10px] bg-secondary dark:bg-primary"
                        >
                            Registrati
                        </Button>
                        {/* Testo cambio tipo autenticazione */}
                        <p className="text-xsmall text-primary-text max-w-[300px] leading-4 mt-[30px]">
                            Possiedi già un account?{' '}
                            <Link
                                to={`/auth/login${
                                    page
                                        ? `?page=${encodeURIComponent(page)}`
                                        : ''
                                }`}
                                className="text-primary font-semibold"
                            >
                                Accedi
                            </Link>
                        </p>
                    </>
                ) : (
                    <>
                        {/* Titolo */}
                        <h1 className="text-xlarge text-primary-text leading-5 font-bold">
                            Bentornato!👋
                        </h1>
                        {/* Descrizione */}
                        <p className="text-xsmall text-primary-text max-w-[300px] leading-4 mb-[20px]">
                            Accedi al tuo account e controlla come stanno
                            crescendo le tue colture
                        </p>
                        {/* Input email */}
                        <Input
                            placeholder="Inserisci l'Email"
                            value={email.text}
                            setValue={(text) => setEmail({ ...email, text })}
                            error={email.error}
                            setError={(error) => setEmail({ ...email, error })}
                        />
                        {/* Input password */}
                        <Input
                            placeholder="Inserisci la Password"
                            value={password.text}
                            setValue={(text) =>
                                setPassword({ ...password, text })
                            }
                            type="password"
                            error={password.error}
                            setError={(error) =>
                                setPassword({ ...password, error })
                            }
                        />
                        {/* Pulsante invio */}
                        <Button
                            onClick={async () => {
                                await login(
                                    email.text,
                                    password.text,
                                    setLoading,
                                    setError,
                                );
                                navigator(page || '/account');
                                setEmail({ ...email, text: '' });
                                setPassword({ ...password, text: '' });
                            }}
                            className="mt-[10px] bg-secondary dark:bg-primary"
                        >
                            Accedi
                        </Button>
                        {/* Testo cambio tipo autenticazione */}
                        <p className="text-xsmall text-primary-text max-w-[300px] leading-4 mt-[30px]">
                            Non hai ancora un account?{' '}
                            <Link
                                to={`/auth/register${
                                    page
                                        ? `?page=${encodeURIComponent(page)}`
                                        : ''
                                }`}
                                className="text-primary font-semibold"
                            >
                                Registrati
                            </Link>
                        </p>
                    </>
                )}
            </div>
            <BottomBar />
        </Page>
    );
}

// Esportazione pagina
export default Auth;
