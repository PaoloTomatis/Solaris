// Importazione moduli
import BottomBar from '../components/BottomBar.comp';
import Button from '../components/Button.comp';
// Importazione immagini
import cactusImg from '../assets/images/cactus.png';

// Pagina 404
function Page404() {
    return (
        <>
            <div className="w-screen h-screen max-h-screen flex flex-col items-center justify-center bg-primary-bg pb-[15vh] overflow-y-hidden">
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
                <Button
                    className="mt-4 hover:bg-black hover:text-white"
                    link="/"
                >
                    Torna alla HOME
                </Button>
            </div>
            <BottomBar />
        </>
    );
}

// Esportazione pagina
export default Page404;
