// Importazione moduli
import { io } from '../server.js';
import type { AuthenticatedSocket } from '../types/types.js';

// Gestore stato
function status(
    socket: AuthenticatedSocket,
    data: { lastSeen?: string | Date }
) {
    // Controllo dispositivo
    if (socket.device) {
        // Ricavo dati richiesta
        let { lastSeen } = data;

        // Controllo lastSeen
        if (!lastSeen || isNaN(new Date(lastSeen).getTime())) {
            lastSeen = new Date();
        }
        // Controllo stanza
        const isRoomActive: boolean =
            (io.sockets.adapter.rooms.get(`USER-${socket.device.userId}`)
                ?.size || 0) > 0;
        if (!isRoomActive) {
            socket.emit('error', 'Il dispositivo non è connesso o attivo!');
            return;
        }

        // Invio rispsta finale
        io.to(`USER-${socket.device.userId}`).emit('status', { lastSeen });
    }
}

// Esportazione gestore
export default status;
