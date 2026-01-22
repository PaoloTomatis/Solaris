// Importazione moduli
import z from 'zod';
import type {
    DeleteIrrigationsQuerySchema,
    GetIrrigationsQuerySchema,
    PostIrrigationsBodySchema,
} from '../schemas/Irrigations.schema.js';
import type { UserType, DeviceType } from '../types/types.js';
import devicesRepository from '../repositories/devices.repository.js';
import irrigationsRepository from '../repositories/irrigations.repository.js';
import dataParser from '../utils/dataParser.js';

// Servizio get /irrigations
async function getIrrigationsService(
    payload: z.infer<typeof GetIrrigationsQuerySchema>,
    user?: UserType,
) {
    //TODO Errore custom
    // Controllo utente
    if (!user) throw new Error('Invalid authentication');

    // Richiesta dispositivo database
    const device = await devicesRepository.findOneSafe(
        payload.deviceId,
        user.id,
    );

    //TODO Errore custom
    // Controllo dispositivo
    if (!device)
        throw new Error(
            "The device does not exists or the user isn't allowed to get it",
        );

    // Richiesta irrigazione database
    const irrigations = await irrigationsRepository.findMany(payload);

    // Iterazione irrigazioni
    irrigations.map((irrigation) => {
        // Conversione irrigazione
        return dataParser(
            irrigation.toObject(),
            ['schemaVersion', '__v'],
            true,
        );
    });

    // Ritorno irrigazioni
    return irrigations;
}

// Servizio post /irrigations
async function postIrrigationsService(
    payload: z.infer<typeof PostIrrigationsBodySchema>,
    device?: DeviceType,
) {
    //TODO Errore custom
    // Controllo dispositivo
    if (!device) throw new Error('Invalid authentication');

    // Creazione irrigazione database
    const irrigation = await irrigationsRepository.createOne(
        payload,
        device.id,
    );

    // Conversione irrigazione
    const parsedIrrigation = dataParser(
        irrigation.toObject(),
        ['schemaVersion', '__v'],
        true,
    );

    // Ritorno irrigazione
    return parsedIrrigation;
}

// Servizio delete /irrigations
async function deleteIrrigationsService(
    payload: z.infer<typeof DeleteIrrigationsQuerySchema>,
    user?: UserType,
) {
    //TODO Errore custom
    // Controllo utente
    if (!user) throw new Error('Invalid authentication');

    // Richiesta dispositivo database
    const device = await devicesRepository.findOneSafe(
        payload.deviceId,
        user.id,
    );

    //TODO Errore custom
    // Controllo dispositivo
    if (!device)
        throw new Error(
            "The device does not exists or the user isn't allowed to get it",
        );

    // Eliminazione irrigazioni database
    await irrigationsRepository.deleteManyByDevice(payload.deviceId);

    // Ritorno null
    return null;
}

// Esportazione servizio
export {
    getIrrigationsService,
    postIrrigationsService,
    deleteIrrigationsService,
};
