// Importazione moduli
import { usePopup } from '../../context/global/Popup.context';
import Button from '../global/Button.comp';
import { postData } from '../../utils/v2/apiCrud.utils';
import { useNotifications } from '../../context/global/Notifications.context';

// Componente misurazioni
function Calibration({
    code,
    name,
    rules,
    value,
    accessToken,
    deviceId,
    setError,
    setLoading,
    type,
}: {
    code: 'sensorHumIMax' | 'sensorHumIMin' | 'sensorLumMax' | 'sensorLumMin';
    name: string;
    rules: string;
    accessToken: string;
    deviceId: string;
    setError: React.Dispatch<React.SetStateAction<string>>;
    setLoading: React.Dispatch<React.SetStateAction<boolean>>;
    value?: number;
    type?: 'normal' | 'disabled';
}) {
    // Notificatore
    const notify = useNotifications();
    // Popupper
    const popupper = usePopup();

    return (
        // Contenitore principale
        <div className="flex flex-col items-center gap-[5px]">
            <h2 className="text-primary-text text-medium">{name}</h2>
            <p className="text-primary-text text-small">{value || '-'}</p>
            <Button
                type={type == 'disabled' ? 'error' : 'info'}
                onClick={
                    type !== 'disabled'
                        ? () =>
                              popupper(
                                  'CALIBRAZIONE SENSORE',
                                  'Procedi',
                                  rules,
                                  'info',
                                  async () => {
                                      // Gestione errori
                                      try {
                                          // Controllo token
                                          if (accessToken) {
                                              await postData(
                                                  `devices-settings/${deviceId}/calibration`,
                                                  'api',
                                                  accessToken,
                                                  { sensor: code },
                                              );
                                          }
                                      } catch (error: any) {
                                          setError(error.message);
                                      } finally {
                                          setLoading(false);
                                      }
                                  },
                              )
                        : () => {
                              notify(
                                  'DISPOSITIVO INATTIVO',
                                  'Il dispositivo è al momento irrangiungibile e non può ricevere comandi',
                                  'error',
                              );
                          }
                }
                className="mt-[10px] max-w-max"
            >
                Avvia Calibrazione
            </Button>
        </div>
    );
}

// Esportazione componente
export default Calibration;
