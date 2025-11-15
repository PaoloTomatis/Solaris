// Importazione moduli
import type { AuthenticatedWS } from '../types/types.js';
import DeviceModel from '../models/Device.model.js';
import mongoose from 'mongoose';
import { emitToRoom } from '../utils/wsRoomHandlers.js';

// Gestore irrigazione
async function irrigation(
    ws: AuthenticatedWS,
    data: { deviceId?: string; duration?: string; completed?: boolean }
): Promise<void> {
    // Controllo utente
    if (!ws.user) {
        ws.send(
            JSON.stringify({
                event: 'error',
                message: 'Autenticazione non effettuata correttamente!',
            })
        );
        ws.close(4001, 'Autenticazione non effettuata correttamente!');
        return;
    }

    // Ricavo dati richiesta
    const { deviceId, duration, completed } = data;

    // Controllo deviceId
    if (!deviceId || !mongoose.isValidObjectId(deviceId)) {
        ws.send(
            JSON.stringify({
                event: 'error',
                message: 'Campo "deviceId" invalido o mancante!',
            })
        );
        return;
    }

    // Controllo duration
    const parsedDuration = Number(duration);
    if (isNaN(parsedDuration) || parsedDuration <= 0) {
        ws.send(
            JSON.stringify({
                event: 'error',
                message: "Campo 'duration' invalido!",
            })
        );
        return;
    }

    // Controllo completed
    if (typeof completed !== 'boolean') {
        ws.send(
            JSON.stringify({
                event: 'error',
                message: 'Campo "completed" invalido o mancante!',
            })
        );
        return;
    }

    // Ricavo dispositivo database
    const device = await DeviceModel.findById(deviceId);

    // Controllo dispositivo
    if (!device || device?.userId.toString() !== ws.user.id) {
        ws.send(
            JSON.stringify({
                event: 'error',
                message:
                    "Il dispositivo è inesistente o non appartiene all'utente autenticato!",
            })
        );
        return;
    }

    // Controllo modalità dispositivo
    if (device.mode !== 'config' || device.activatedAt === null) {
        ws.send(
            JSON.stringify({
                event: 'error',
                message:
                    'Il dispositivo non è attivo o non è in modalità configurazione!',
            })
        );
        return;
    }

    // Invio evento finale
    emitToRoom(`DEVICE-${deviceId}`, {
        event: 'irrigation',
        duration: parsedDuration,
        completed,
    });

    console.log(`Emissione --> ${deviceId} | Durata: ${parsedDuration}`);
}

// Esportazione gestore
export default irrigation;
