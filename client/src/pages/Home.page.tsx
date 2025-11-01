// Importazione moduli
import Page from '../components/Page.comp';
import BottomBar from '../components/BottomBar.comp';

// Pagina home
function Home() {
    return (
        <Page className="justify-center">
            <h1 className="text-primary dark:text-secondary text-[5rem] text-center">
                SOLARIS HUB
            </h1>
            <BottomBar />
        </Page>
    );
}

// Esportazione pagina
export default Home;
