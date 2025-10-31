// Importazione moduli
import Page from './Page.comp';
import BottomBar from './BottomBar.comp';

// Componente dati
function Loading() {
    return (
        <Page className="justify-center">
            <p className="text-primary-text text-small font-bold">
                Caricamento...
            </p>
            <BottomBar />
        </Page>
    );
}

// Esportazione componente
export default Loading;
