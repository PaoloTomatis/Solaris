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
import {
    algorithmUpdateKInterval,
    algorithmHumX,
    algorithmInterval,
} from '../utils/irrigationAlgorithm.js';
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
        return dataParser(irrigation, ['schemaVersion', '__v'], true);
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
    const irrigation = await irrigationsRepository.createOne({
        ...payload,
        deviceId: device.id,
    });

    // Richiesta impostazioni database
    const settings = await devicesSettingsRepository.findOneByDeviceId(
        device.id,
    );

    // Controllo impostazioni
    if (!settings) throw new Error('Device settings not found');

    // Controllo tipo, humIMax, humIMin e kInterval
    if (
        irrigation.type == 'config' &&
        !settings.humIMin &&
        !settings.humIMax &&
        !settings.kInterval
    ) {
        // Richiesta irrigazioni database
        const irrigations = await irrigationsRepository.findMany({
            deviceId: device.id as string,
            limit: 20,
            sort: [{ field: 'irrigatedAt', order: 'desc' }],
        });

        // Calcolo algoritmo
        const humIMin = algorithmHumX(irrigations, 0, false);
        const humIMax = algorithmHumX(irrigations, 1, false);
        const kInterval = algorithmInterval(irrigations, false);

        // Modifica impostazioni dispositivo
        const deviceSettings =
            await devicesSettingsRepository.updateOneByDeviceId(device.id, {
                ...payload,
                humIMin,
                humIMax,
                kInterval,
            });

        // Controllo impostazioni dispositivo
        if (!deviceSettings)
            throw new Error('Update of device settings failed');
    }

    // Inizializzazione nuove impostazioni
    let newSettings: DevicesSettingsType | null = null;

    // Controllo humIMax e kInterval
    if (settings.humIMax && settings.kInterval) {
        // Calcolo impostazioni
        const newKInterval = algorithmUpdateKInterval(
            payload.humIBefore,
            payload.humIAfter,
            settings.humIMax,
            settings.kInterval,
        );

        // Aggiornamento impostazioni
        newSettings = await devicesSettingsRepository.updateOneByDeviceId(
            device.id,
            { kInterval: newKInterval },
        );

        // Controllo nuove impostazioni
        if (!newSettings) throw new Error('Update of device settings failed');
    }

    // Conversione irrigazione
    const parsedIrrigation = dataParser(
        irrigation,
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
    const settings = await devicesSettingsRepository.findOneByDeviceId(
        payload.deviceId,
    );

    // Controllo impostazioni dispositivo
    if (!settings) throw new Error('Device settings not found');

    // Controllo modalità
    if (settings.mode == 'auto' || settings.mode == 'safe')
        throw new Error("The device mustn't be in automatic or safe mode");

    // Dichiarazione intervallo
    let interval = payload.interval;

    // Controllo humI e kInterval
    if (!settings.kInterval && payload.humI)
        throw new Error("KInterval hasn't been computed yet");

    // Controllo humI
    if (payload.humI) {
        interval = Number(
            (payload.humI * (settings?.kInterval as number)).toFixed(0),
        );
    }

    // Ritorno intervallo
    return interval;
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
