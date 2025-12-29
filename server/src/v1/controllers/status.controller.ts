// Importazione moduli
import type { AuthenticatedWS } from '../../global/types/types.js';
import resHandler from '../../global/utils/responseHandler.js';
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
                resHandler(
                    `DEVICE-${ws.device.id}`,
                    404,
                    null,
                    'Dispositivo non collegato ad un utente!',
                    false,
                    'ws'
                );
            } else {
                // Invio risposta finale
                emitToRoom(`USER-${ws.device.userId}`, {
                    event: 'status',
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
        return resHandler(
            `DEVICE-${ws.device?.id}`,
            500,
            null,
            errorMsg,
            false,
            'ws'
        );
    }
}

// Esportazione gestore
export default status;
