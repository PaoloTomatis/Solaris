// Importazione moduli
import { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import Input from '../components/Input.comp';
import Button from '../components/Button.comp';
import BottomBar from '../components/BottomBar.comp';

// Pagina autenticazione
function Auth() {
    // Stato email
    const [email, setEmail] = useState('');
    // Stato password
    const [password, setPassword] = useState('');
    // Tipo autenticazione
    const { type } = useParams();

    return (
        // Contenitore pagina
        <div className="bg-primary-bg flex flex-col items-center justify-center w-screen min-h-screen">
            {/* Contenitore campi */}
            <div className="flex flex-col gap-[12px] border-black border-[2px] bg-secondary-bg rounded-3xl px-4 py-6 items-center justify-center w-[90%] max-w-[350px]">
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
                        />
                        {/* Input password */}
                        <Input
                            placeholder="Inserisci la Password"
                            value={password}
                            setValue={setPassword}
                            type="password"
                        />
                        {/* Pulsante invio */}
                        <Button
                            onClick={() => {
                                alert(
                                    `REGISTRAZIONE --> ${email} - ${password}`
                                );
                                setEmail('');
                                setPassword('');
                            }}
                            className="mt-[10px] bg-secondary"
                        >
                            Registrati
                        </Button>
                        {/* Testo cambio tipo autenticazione */}
                        <p className="text-xxsmall text-primary-text max-w-[300px] leading-4 mt-[30px]">
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
                        />
                        {/* Input password */}
                        <Input
                            placeholder="Inserisci la Password"
                            value={password}
                            setValue={setPassword}
                            type="password"
                        />
                        {/* Pulsante invio */}
                        <Button
                            onClick={() => {
                                alert(`ACCESSO --> ${email} - ${password}`);
                                setEmail('');
                                setPassword('');
                            }}
                            className="mt-[10px] bg-secondary"
                        >
                            Accedi
                        </Button>
                        {/* Testo cambio tipo autenticazione */}
                        <p className="text-xxsmall text-primary-text max-w-[300px] leading-4 mt-[30px]">
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
        </div>
    );
}

// Esportazione pagina
export default Auth;
