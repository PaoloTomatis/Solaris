// Importazione moduli
import {
    createContext,
    useContext,
    useEffect,
    useState,
    type ReactNode,
} from 'react';
import Popup from '../../components/global/Popup.comp';

// Tipo tipi popup
type PopupType = 'info' | 'error' | 'warning' | 'success';

// Tipo impostazione popup
interface PopupOptions {
    children: ReactNode;
    title: string;
    desc?: string;
    type?: PopupType;
    onClick?: () => void | Promise<void>;
}

// Contesto popup
const PopupContext = createContext<
    | ((
          title: string,
          children: ReactNode,
          desc?: string,
          type?: PopupType,
          onClick?: () => void | Promise<void>,
      ) => void)
    | null
>(null);

// Provider popup
function PopupProvider({ children }: { children: ReactNode }) {
    // Stato visualizzazione popup
    const [show, setShow] = useState(false);
    // Stato popup
    const [popup, setPopup] = useState<PopupOptions | null>(null);

    // Controllo visualizzazione
    useEffect(() => {
        if (!show) {
            setPopup(null);
        }
    }, [show]);

    // Funzione popupper
    function popupper(
        title: string,
        children: ReactNode,
        desc?: string,
        type?: 'info' | 'error' | 'warning' | 'success',
        onClick?: () => void | Promise<void>,
    ) {
        setPopup({ title, desc, type, children, onClick });
        setShow(true);
    }

    return (
        <PopupContext value={popupper}>
            {show ? (
                <Popup
                    tit={popup?.title || ''}
                    desc={popup?.desc || ''}
                    setVisible={setShow}
                    type={popup?.type || 'info'}
                    onClick={popup?.onClick}
                >
                    {popup?.children}
                </Popup>
            ) : (
                ''
            )}
            {children}
        </PopupContext>
    );
}

// Hook popup
function usePopup() {
    const context = useContext(PopupContext);
    // Controllo contesto
    if (!context) {
        throw new Error('usePopup must be in a PopupProvider');
    }
    return context;
}

// Esportazione hook e provider
export { usePopup, PopupProvider };
