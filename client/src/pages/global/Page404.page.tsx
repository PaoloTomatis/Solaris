// Importazione moduli
import BottomBar from '../../components/global/BottomBar.comp';
import Button from '../../components/global/Button.comp';
import Page from '../../components/global/Page.comp';
// Importazione immagini
import cactusImg from '../assets/images/cactus.png';

// Pagina 404
function Page404() {
    return (
        <Page className="max-h-screen overflow-y-hidden justify-center">
            <h1 className="text-xxlarge text-primary font-bold leading-[9rem]">
                404
            </h1>
            <p className="text-small text-primary-text text-center max-w-96 z-20 leading-5">
                Oops... non abbiamo trovato questa pagina! Forse deve ancora
                fiorire🌼
            </p>
            <img
                className="w-max max-w-[200px] absolute bottom-[10vh] right-0 z-10"
                src={cactusImg}
                alt="Cactus🌵"
            />
            <Button className="mt-4 hover:bg-black hover:text-white" link="/">
                Torna alla HOME
            </Button>
            <BottomBar />
        </Page>
    );
}

// Esportazione pagina
export default Page404;
