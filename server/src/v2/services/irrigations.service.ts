// Importazione moduli
import z from 'zod';
import type {
    GetIrrigationsQuerySchema,
    PostIrrigationsBodySchema,
} from '../schemas/Irrigations.schema.js';
import type { UserType, DeviceType } from '../types/types.js';
import devicesRepository from '../repositories/devices.repository.js';
import irrigationsRepository from '../repositories/irrigations.repository.js';

// Servizio get /irrigations
async function getIrrigationsService(
    payload: z.infer<typeof GetIrrigationsQuerySchema>,
    user?: UserType
) {
    //TODO Errore custom
    // Controllo utente
    if (!user) throw new Error('Invalid authentication');

    // Richiesta dispositivo database
    const device = await devicesRepository.findOneSafe(
        payload.deviceId,
        user.id
    );

    //TODO Errore custom
    // Controllo dispositivo
    if (!device)
        throw new Error(
            "The device does not exists or the user isn't allowed to get it"
        );

    // Richiesta irrigazione database
    const irrigations = await irrigationsRepository.findMany(payload);

    // Ritorno irrigazioni
    return irrigations;
}

// Servizio post /irrigations
async function postIrrigationsService(
    payload: z.infer<typeof PostIrrigationsBodySchema>,
    device?: DeviceType
) {
    //TODO Errore custom
    // Controllo dispositivo
    if (!device) throw new Error('Invalid authentication');

    // Creazione irrigazione database
    const irrigation = await irrigationsRepository.createOne(
        payload,
        device.id
    );

    // Ritorno irrigazione
    return irrigation;
}

// Esportazione servizio
export { getIrrigationsService, postIrrigationsService };
