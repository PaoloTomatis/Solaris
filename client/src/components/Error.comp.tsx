// Importazione moduli
import Page from './Page.comp';
import BottomBar from './BottomBar.comp';

// Componente dati
function Error({ error }: { error: string }) {
    return (
        <Page>
            <h2 className="text-large text-error">Errore!</h2>
            <p className="text-primary-text text-small">{error}</p>
            <BottomBar />
        </Page>
    );
}

// Esportazione componente
export default Error;
