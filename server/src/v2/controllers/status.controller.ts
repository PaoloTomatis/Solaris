// Importazione moduli
import type { AuthenticatedWS } from '../types/types.js';
import resHandler from '../../v2/utils/responseHandler.js';
import { emitToRoom } from '../../global/utils/wsRoomHandlers.js';

// Gestore stato
function status(ws: AuthenticatedWS, data: { lastSeen?: string | Date }) {
    // Gestione errori
    try {
        // Controllo dispositivo
        if (ws.device) {
            // Ricavo dati richiesta
            let { lastSeen } = data;

            // Controllo lastSeen
            if (!lastSeen || isNaN(new Date(lastSeen).getTime())) {
                lastSeen = new Date();
            }

            // Controllo userId
            if (!ws.device.userId) {
                return resHandler(
                    `DEVICE-${ws.device.id}`,
                    false,
                    404,
                    'Invalid authentication',
                );
            } else {
                // Invio risposta finale
                emitToRoom(`USER-${ws.device.userId}`, {
                    event: 'v2/status',
                    deviceId: ws.device.id,
                    lastSeen,
                });
            }
        }
    } catch (error: unknown) {
        // Errore in console
        console.error(error);
        const errorMsg =
            error instanceof Error
                ? error?.message || 'Errore interno del server!'
                : 'Errore sconosciuto!';
        // Risposta finale
        return resHandler(`DEVICE-${ws.device?.id}`, false, 500, errorMsg);
    }
}

// Esportazione gestore
export default status;
