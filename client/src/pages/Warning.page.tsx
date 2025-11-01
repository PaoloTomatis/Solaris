// Importazione moduli
import { useLocation, useNavigate } from 'react-router-dom';
import Page from '../components/Page.comp';
import Button from '../components/Button.comp';

// Pagina avviso
function Warning() {
    // Navigatore
    const navigator = useNavigate();
    // Pagina
    const location = useLocation();
    const searchParams = new URLSearchParams(location.search);
    const page = searchParams.get('page');

    return (
        <Page className="justify-center gap-7 pt-[10vh] pb-0">
            <h1 className="text-error text-large text-center font-bold">
                SOLARISHUB | AVVISO DI RESPONSABILITÀ
            </h1>
            <p className="text-primary-text text-small max-w-[500px] w-[95%]">
                Questo sito è stato realizzato a scopo personale e sperimentale.
                L'autore non è uno sviluppatore professionista e non può
                garantire la sicurezza, l'affidabilità o la corretta protezione
                dei dati inseriti o trasmessi attraverso il sito.
            </p>
            <p className="text-primary-text text-small max-w-[500px] w-[95%]">
                L'accesso e l'utilizzo del sito avvengono a proprio rischio.
                L'autore non si assume alcuna responsabilità per eventuali
                danni, perdite di dati, violazioni di sicurezza o altri problemi
                derivanti dall'uso del sito.
            </p>
            <p className="text-primary-text text-small max-w-[500px] w-[95%]">
                Utilizzando questo sito, l'utente accetta integralmente queste
                condizioni e riconosce che qualsiasi conseguenza derivante dal
                suo utilizzo è di sua esclusiva responsabilità.
            </p>
            <Button
                className="mt-[10px] bg-error"
                onClick={() => {
                    sessionStorage.setItem('isWarned', 'true');
                    navigator(page || '/');
                }}
            >
                Accetto e Proseguo
            </Button>
        </Page>
    );
}

// Esportazione pagina
export default Warning;
