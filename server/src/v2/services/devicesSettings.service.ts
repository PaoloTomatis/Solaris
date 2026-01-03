// Importazione moduli
import type { DeviceType, UserType } from '../types/types.js';
import z from 'zod';
import devicesSettingsRepository from '../repositories/devicesSettings.repository.js';
import type { PatchDevicesSettingsBodySchema } from '../schemas/DevicesSettings.schema.js';
import devicesRepository from '../repositories/devices.repository.js';
import usersRepository from '../repositories/users.repository.js';
import type {
    GetDevicesParamsSchema,
    PatchDevicesParamsSchema,
} from '../schemas/Devices.schema.js';

// Servizio get /devices-settings/:deviceId
async function getDevicesSettingsService(
    { deviceId }: z.infer<typeof GetDevicesParamsSchema>,
    user?: UserType
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
            "The device does not exists or the user isn't allowed to get it"
        );

    // Richiesta impostazioni dispositivo database
    const deviceSettings = await devicesSettingsRepository.findOne(deviceId);

    //TODO Errore custom
    // Controllo impostazioni dispositivo
    if (!deviceSettings) throw new Error('Device settings not found');

    // Ritorno impostazioni dispositivo
    return deviceSettings;
}

// Servizio get me/device-settings
async function getMeSettingsService(device?: DeviceType) {
    //TODO Errore custom
    // Controllo dispositivo
    if (!device) throw new Error('Invalid authentication');

    // Richiesta utente database
    const user = await usersRepository.findOne(device.userId || '');

    // Controllo utente
    if (!user) throw new Error('The device must be owned by a user');

    // Richiesta impostazioni dispositivo database
    const deviceSettings = await devicesSettingsRepository.findOne(device.id);

    //TODO Errore custom
    // Controllo impostazioni dispositivo
    if (!deviceSettings) throw new Error('Device settings not found');

    // Ritorno impostazioni dispositivo
    return deviceSettings;
}

// Servizio patch /device-settings/:deviceId
async function patchDevicesSettingsService(
    payload: z.infer<typeof PatchDevicesSettingsBodySchema>,
    deviceId: string,
    user?: UserType
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
            "The device does not exists or the user isn't allowed to get it"
        );

    // Modifica impostazioni dispositivo
    const deviceSettings = await devicesSettingsRepository.updateOne(
        payload,
        deviceId
    );

    //TODO Errore custom
    // Controllo impostazioni dispositivo
    if (!deviceSettings) throw new Error('Update of device settings failed');

    // Ritorno impostazioni dispositivo
    return deviceSettings;
}

// Esportazione servizi
export {
    getDevicesSettingsService,
    getMeSettingsService,
    patchDevicesSettingsService,
};
