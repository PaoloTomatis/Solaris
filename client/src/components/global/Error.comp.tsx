// Importazione moduli
import Page from './Page.comp';
import BottomBar from './BottomBar.comp';
// Importazione immagini
import CloseIcon from '../../assets/icons/close.svg?react';

// Componente dati
function Error({
    error,
    setError,
}: {
    error: string;
    setError: React.Dispatch<React.SetStateAction<string>>;
}) {
    return (
        <Page className="justify-center">
            <h2 className="text-large text-error font-bold">Errore!</h2>
            <p className="text-primary-text text-small">{error}</p>
            <CloseIcon
                onClick={() => setError('')}
                className="cursor-pointer fill-current text-primary-text fixed top-5 right-5 w-[25px] aspect-square"
            />
            <BottomBar />
        </Page>
    );
}

// Esportazione componente
export default Error;
