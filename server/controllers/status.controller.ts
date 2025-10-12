// Importazione moduli
import type { AuthenticatedWS } from '../types/types.js';
import { emitToRoom } from '../utils/wsRoomHandlers.js';

// Gestore stato
function status(ws: AuthenticatedWS, data: { lastSeen?: string | Date }) {
    // Controllo dispositivo
    if (ws.device) {
        // Ricavo dati richiesta
        let { lastSeen } = data;

        // Controllo lastSeen
        if (!lastSeen || isNaN(new Date(lastSeen).getTime())) {
            lastSeen = new Date();
        }

        // Invio risposta finale
        emitToRoom(`USER-${ws.device.userId}`, { event: 'status', lastSeen });
    }
}

// Esportazione gestore
export default status;
