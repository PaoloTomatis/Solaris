// Importazione moduli
import z from 'zod';
import type {
    DeleteIrrigationsQuerySchema,
    GetIrrigationsQuerySchema,
    PostIrrigationsBodySchema,
    PostIrrigationsExecuteBodySchema,
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
    // Controllo utente
    if (!user) throw new Error('Invalid authentication');

    // Richiesta dispositivo database
    const device = await devicesRepository.findOneSafe(
        payload.deviceId,
        user.id,
    );

    // Controllo dispositivo
    if (!device)
        throw new Error(
            'The device does not exists or is owned by an other user',
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
    // Controllo dispositivo
    if (!device) throw new Error('Invalid authentication');

    // Creazione irrigazione database
    const irrigation = await irrigationsRepository.createOne(
        payload,
        device.id,
    );

    // Richiesta impostazioni database
    const settings = await devicesSettingsRepository.findOne(device.id);

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

        // Controllo nuove impostazioni
        if (!newSettings) throw new Error('Update of device settings failed');
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

// Servizio post /irrigations/execute
async function postIrrigationsExecuteService(
    payload: z.infer<typeof PostIrrigationsExecuteBodySchema>,
    user: UserType,
) {
    // Controllo utente
    if (!user) throw new Error('Invalid authentication');

    // Richiesta dispositivo database
    const device = await devicesRepository.findOneSafe(
        payload.deviceId,
        user.id,
    );

    // Controllo dispositivo
    if (!device)
        throw new Error(
            'The device does not exists or is owned by an other user',
        );

    // Richiesta impostazioni dispositivo database
    const settings = await devicesSettingsRepository.findOne(payload.deviceId);

    // Controllo impostazioni dispositivo
    if (!settings) throw new Error('Device settings not found');

    // Controllo modalità
    if (settings.mode == 'auto' || settings.mode == 'safe')
        throw new Error("The device mustn't be in automatic or safe mode");

    // Ritorno nullo
    return null;
}

// Servizio delete /irrigations
async function deleteIrrigationsService(
    payload: z.infer<typeof DeleteIrrigationsQuerySchema>,
    user?: UserType,
) {
    // Controllo utente
    if (!user) throw new Error('Invalid authentication');

    // Richiesta dispositivo database
    const device = await devicesRepository.findOneSafe(
        payload.deviceId,
        user.id,
    );

    // Controllo dispositivo
    if (!device)
        throw new Error(
            'The device does not exists or is owned by an other user',
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
    postIrrigationsExecuteService,
    deleteIrrigationsService,
};
