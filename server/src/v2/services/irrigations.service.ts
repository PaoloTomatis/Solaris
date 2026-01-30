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
import { algorithmUpdateKInterval } from '../utils/irrigationAlgorithm.js';
import devicesSettingsRepository from '../repositories/devicesSettings.repository.js';
import type { DevicesSettingsType } from '../models/DeviceSettings.model.js';

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
    const parsedIrrigations = irrigations.map((irrigation) => {
        // Conversione irrigazione
        return dataParser(
            irrigation.toObject(),
            ['schemaVersion', '__v'],
            true,
        );
    });

    // Ritorno irrigazioni
    return parsedIrrigations;
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

    // Richiesta impostazioni database
    const settings = await devicesSettingsRepository.findOne(device.id);

    //TODO Errore custom
    // Controllo impostazioni
    if (!settings) throw new Error('Device settings not found');

    // Inizializzazione nuove impostazioni
    let newSettings: DevicesSettingsType | null = null;

    // Controllo tipo, humIMax e kInterval
    if (payload.type == 'auto' && settings.humIMax && settings.kInterval) {
        // Calcolo impostazioni
        const newKInterval = algorithmUpdateKInterval(
            payload.humIBefore,
            payload.humIAfter,
            settings.humIMax,
            settings.kInterval,
        );

        // Aggiornamento impostazioni
        newSettings = await devicesSettingsRepository.updateOne(
            { kInterval: newKInterval },
            device.id,
        );

        //TODO Errore custom
        // Controllo nuove impostazioni
        if (!newSettings) throw new Error('Device settings update failed');
    }

    // Conversione irrigazione
    const parsedIrrigation = dataParser(
        irrigation.toObject(),
        ['schemaVersion', '__v'],
        true,
    );

    // Ritorno irrigazione
    return { irrigation: parsedIrrigation, newSettings };
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
