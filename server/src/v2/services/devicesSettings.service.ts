// Importazione moduli
import type { DeviceType, UserType } from '../types/types.js';
import z from 'zod';
import devicesSettingsRepository from '../repositories/devicesSettings.repository.js';
import type {
    PatchDevicesSettingsBodySchema,
    PatchDevicesSettingsParamsSchema,
} from '../schemas/DevicesSettings.schema.js';
import devicesRepository from '../repositories/devices.repository.js';
import usersRepository from '../repositories/users.repository.js';
import type { GetDeviceParamsSchema } from '../schemas/Devices.schema.js';
import dataParser from '../utils/dataParser.js';
import {
    algorithmHumX,
    algorithmInterval,
} from '../utils/irrigationAlgorithm.js';
import irrigationsRepository from '../repositories/irrigations.repository.js';

// Servizio get /devices-settings/:deviceId
async function getDevicesSettingsService(
    { deviceId }: z.infer<typeof GetDeviceParamsSchema>,
    user?: UserType,
) {
    //TODO Errore custom
    // Controllo utente
    if (!user) throw new Error('Invalid authentication');

    // Richiesta dispositivo database
    const device = await devicesRepository.findOneSafe(deviceId, user.id);

    //TODO Errore custom
    // Controllo dispositivo
    if (!device)
        throw new Error(
            "The device does not exists or the user isn't allowed to get it",
        );

    // Richiesta impostazioni dispositivo database
    const deviceSettings = await devicesSettingsRepository.findOne(deviceId);

    //TODO Errore custom
    // Controllo impostazioni dispositivo
    if (!deviceSettings) throw new Error('Device settings not found');

    // Conversione impostazioni dispositivo
    const parsedDeviceSettings = dataParser(
        deviceSettings.toObject(),
        ['__v', 'schemaVersion'],
        true,
    );

    // Ritorno impostazioni dispositivo
    return parsedDeviceSettings;
}

// Servizio get me/device-settings
async function getMeSettingsService(device?: DeviceType) {
    //TODO Errore custom
    // Controllo dispositivo
    if (!device) throw new Error('Invalid authentication');

    //TODO Errore custom
    // Controllo id utente
    if (!device.userId) throw new Error('The device must be owned by a user');

    // Richiesta utente database
    const user = await usersRepository.findOneById(device.userId);

    // Controllo utente
    if (!user) throw new Error('The device must be owned by a user');

    // Richiesta impostazioni dispositivo database
    const deviceSettings = await devicesSettingsRepository.findOne(device.id);

    //TODO Errore custom
    // Controllo impostazioni dispositivo
    if (!deviceSettings) throw new Error('Device settings not found');

    // Conversione impostazioni dispositivo
    const parsedDeviceSettings = dataParser(
        deviceSettings.toObject(),
        ['__v', 'schemaVersion'],
        true,
    );

    // Ritorno impostazioni dispositivo
    return parsedDeviceSettings;
}

// Servizio patch /device-settings/:deviceId
async function patchDevicesSettingsService(
    payload: z.infer<typeof PatchDevicesSettingsBodySchema>,
    { deviceId }: z.infer<typeof PatchDevicesSettingsParamsSchema>,
    user?: UserType,
) {
    //TODO Errore custom
    // Controllo dispositivo
    if (!user) throw new Error('Invalid authentication');

    // Richiesta dispositivo database
    const device = await devicesRepository.findOneSafe(deviceId, user.id);

    //TODO Errore custom
    // Controllo dispositivo
    if (!device)
        throw new Error(
            "The device does not exists or the user isn't allowed to get it",
        );

    let humIMin = payload.humIMin;
    let humIMax = payload.humIMax;
    let kInterval = payload.kInterval;

    //TODO Esecuzione algoritmi
    // Controllo cambio modalità automatica
    if (payload.mode == 'auto') {
        // Richiesta irrigazioni database
        const irrigations = await irrigationsRepository.findMany({
            deviceId,
            limit: 20,
            sort: [{ field: 'irrigatedAt', order: 'desc' }],
        });

        // Calcolo algoritmo
        humIMin = algorithmHumX(irrigations, 0);
        humIMax = algorithmHumX(irrigations, 1);
        kInterval = algorithmInterval(irrigations);
    }

    // Modifica impostazioni dispositivo
    const deviceSettings = await devicesSettingsRepository.updateOne(
        { ...payload, humIMin, humIMax, kInterval },
        deviceId,
    );

    //TODO Errore custom
    // Controllo impostazioni dispositivo
    if (!deviceSettings) throw new Error('Update of device settings failed');

    // Conversione impostazioni dispositivo
    const parsedDeviceSettings = dataParser(
        deviceSettings.toObject(),
        ['__v', 'schemaVersion'],
        true,
    );

    // Ritorno impostazioni dispositivo
    return parsedDeviceSettings;
}

// Esportazione servizi
export {
    getDevicesSettingsService,
    getMeSettingsService,
    patchDevicesSettingsService,
};
