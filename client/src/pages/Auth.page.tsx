// Importazione moduli
import { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useAuth } from '../context/Auth.context';
import Input from '../components/Input.comp';
import Button from '../components/Button.comp';
import BottomBar from '../components/BottomBar.comp';
import Page from '../components/Page.comp';
import Error from '../components/Error.comp';
import Loading from '../components/Loading.comp';

// Pagina autenticazione
function Auth() {
    // Autenticazione
    const { login, register } = useAuth();

    // Stato email
    const [email, setEmail] = useState('');
    // Stato password
    const [password, setPassword] = useState('');
    // Stato caricamento
    const [loading, setLoading] = useState(false);
    // Stato errore email
    const [emailError, setEmailError] = useState('');
    // Stato errore password
    const [passwordError, setPasswordError] = useState('');
    // Stato errore
    const [error, setError] = useState('');
    // Tipo autenticazione
    const { type } = useParams();

    // Controllo errore
    if (error) {
        return <Error error={error} setError={setError} />;
    }

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
                            value={email}
                            setValue={setEmail}
                            error={emailError}
                            setError={setEmailError}
                        />
                        {/* Input password */}
                        <Input
                            placeholder="Inserisci la Password"
                            value={password}
                            setValue={setPassword}
                            type="password"
                            error={passwordError}
                            setError={setPasswordError}
                        />
                        {/* Pulsante invio */}
                        <Button
                            onClick={async () => {
                                if (
                                    !/^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/.test(
                                        email
                                    )
                                ) {
                                    setEmailError(
                                        "L'email deve essere formata nome@domin.io"
                                    );
                                }

                                if (
                                    !/^(?=.*\d)(?=.*[^a-zA-Z0-9]).{8,255}$/.test(
                                        password
                                    )
                                ) {
                                    setPasswordError(
                                        'La password deve contenere 8 caratteri di cui uno speciale e un numero'
                                    );
                                } else {
                                    await register(
                                        email,
                                        password,
                                        setLoading,
                                        setError
                                    );
                                    setEmail('');
                                    setPassword('');
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
                                to={'/auth/login'}
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
                            value={email}
                            setValue={setEmail}
                            error={emailError}
                            setError={setEmailError}
                        />
                        {/* Input password */}
                        <Input
                            placeholder="Inserisci la Password"
                            value={password}
                            setValue={setPassword}
                            type="password"
                            error={passwordError}
                            setError={setPasswordError}
                        />
                        {/* Pulsante invio */}
                        <Button
                            onClick={async () => {
                                await login(
                                    email,
                                    password,
                                    setLoading,
                                    setError
                                );
                                setEmail('');
                                setPassword('');
                            }}
                            className="mt-[10px] bg-secondary dark:bg-primary"
                        >
                            Accedi
                        </Button>
                        {/* Testo cambio tipo autenticazione */}
                        <p className="text-xsmall text-primary-text max-w-[300px] leading-4 mt-[30px]">
                            Non hai ancora un account?{' '}
                            <Link
                                to={'/auth/register'}
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
