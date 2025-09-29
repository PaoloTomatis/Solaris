// Importazione moduli
import { io } from '../server.js';
import type { AuthenticatedSocket } from '../types/types.js';
import DeviceModel from '../models/Device.model.js';
import mongoose from 'mongoose';

// Gestore irrigazione
async function irrigation(
    socket: AuthenticatedSocket,
    data: { deviceId?: string; duration?: string; completed?: boolean }
): Promise<void> {
    // Controllo utente
    if (!socket.user) {
        socket.emit('error', 'Autenticazione non effettuata correttamente!');
        socket.disconnect(true);
        return;
    }

    // Ricavo dati richiesta
    const { deviceId, duration, completed } = data;

    // Controllo deviceId
    if (!deviceId || !mongoose.isValidObjectId(deviceId)) {
        socket.emit('error', 'Campo "deviceId" invalido o mancante!');
        return;
    }

    // Controllo duration
    const parsedDuration = Number(duration);
    if (isNaN(parsedDuration) || parsedDuration <= 0) {
        socket.emit('error', "Campo 'duration' invalido!");
        return;
    }

    // Controllo completed
    if (typeof completed !== 'boolean') {
        socket.emit('error', 'Campo "completed" invalido o mancante!');
        return;
    }

    // Ricavo dispositivo database
    const device = await DeviceModel.findById(deviceId);

    // Controllo dispositivo
    if (!device || device?.userId.toString() !== socket.user.id) {
        socket.emit(
            'error',
            "Il dispositivo è inesistente o non appartiene all'utente autenticato!"
        );
        return;
    }

    // Controllo modalità dispositivo
    if (device.mode !== 'config' || device.activatedAt === null) {
        socket.emit(
            'error',
            'Il dispositivo non è attivo o non è in modalità configurazione!'
        );
        return;
    }

    // Controllo stanza
    const isRoomActive: boolean =
        (io.sockets.adapter.rooms.get(`DEVICE-${deviceId}`)?.size || 0) > 0;
    if (!isRoomActive) {
        socket.emit('error', 'Il dispositivo non è connesso o attivo!');
        return;
    }

    // Invio evento finale
    io.to(`DEVICE-${deviceId}`).emit('irrigation', {
        parsedDuration,
        completed,
    });
}

// Esportazione gestore
export default irrigation;
