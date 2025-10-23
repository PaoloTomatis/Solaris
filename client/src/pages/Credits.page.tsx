// Importazione moduli
import TopBar from '../components/TopBar.comp';

// Pagina crediti
function Credits() {
    return (
        <div className="flex flex-col w-screen h-screen">
            <TopBar name="Crediti" url="/account" />
        </div>
    );
}

// Esportazione pagina
export default Credits;
