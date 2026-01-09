// Importazione moduli
import { v4 } from 'uuid';
import type { UserType } from '../types/types.js';
import devicesRepository from '../repositories/devices.repository.js';
import { hash } from 'bcrypt';
import pswGenerator from '../../global/utils/pswGenerator.js';
import z from 'zod';
import {
    GetDevicesQuerySchema,
    PatchDevicesBodySchema,
    PatchDevicesParamsSchema,
    PostDevicesBodySchema,
} from '../schemas/Devices.schema.js';

// Servizio get /devices/:id
async function getDeviceService(deviceId: string, user?: UserType) {
    //TODO Errore custom
    // Controllo utente
    if (!user) throw new Error('Invalid authentication');

    // Richiesta dispositivo
    const device = await devicesRepository.findOneSafe(deviceId, user.id);

    //TODO Errore custom
    // Controllo dispositivo
    if (!device)
        throw new Error(
            "The device does not exists or the user isn't allowed to get it"
        );

    // Ritorno dispositivo
    return device;
}

// Servizio get /devices
async function getDevicesService(
    payload: z.infer<typeof GetDevicesQuerySchema>,
    user?: UserType
) {
    //TODO Errore custom
    // Controllo utente
    if (!user) throw new Error('Invalid authentication');

    // Richiesta dispositivi
    const devices = await devicesRepository.findManySafe(payload, user);

    // Ritorno dispositivi
    return devices;
}

// Servizio post /devices
async function postDevicesService(
    body: z.infer<typeof PostDevicesBodySchema>,
    user?: UserType
) {
    //TODO Errore custom
    // Controllo utente
    if (!user) throw new Error('Invalid authentication');

    //TODO Errore custom
    // Controllo ruolo utente
    if (user.role !== 'admin')
        throw new Error('The user has to be an admin to perform this action');

    // Dichiarazione key
    const key = body.key ?? v4();
    // Dichiarazione psw
    const psw = body.psw ?? (await hash(pswGenerator(15), 10));

    // Richiesta dispositivo
    const device = await devicesRepository.createOne({ ...body, psw, key });

    //TODO Errore custom
    // Controllo dispositivo
    if (!device) throw new Error('Creation of the device failed');

    // Ritorno dispositivo
    return device;
}

// Servizio patch /devices/:deviceId
async function patchDevicesService(
    body: z.infer<typeof PatchDevicesBodySchema>,
    { deviceId }: z.infer<typeof PatchDevicesParamsSchema>,
    user?: UserType
) {
    //TODO Errore custom
    // Controllo utente
    if (!user) throw new Error('Invalid authentication');

    // Modifica dispositivo
    const newDevice = await devicesRepository.updateOneSafe(
        deviceId,
        user.id,
        body
    );

    //TODO Errore custom
    // Controllo nuovo device
    if (!newDevice)
        throw new Error(
            "The device does not exists or the user isn't allowed to modify it"
        );

    // Ritorno dispositivo
    return newDevice;
}

// Servizio delete /devices/:deviceId
async function deleteDevicesService(deviceId: string, user?: UserType) {
    //TODO Errore custom
    // Controllo utente
    if (!user) throw new Error('Invalid authentication');

    //TODO Errore custom
    // Controllo ruolo utente
    if (user.role !== 'admin') throw new Error('Forbidden');

    // Eliminazione dispositivo
    const oldDevice = await devicesRepository.deleteOne(deviceId);

    //TODO Errore custom
    // Controllo vecchio dispositivo
    if (!oldDevice)
        throw new Error('The device does not exists or the elimination failed');

    // Ritorno dispositivo
    return oldDevice;
}

// Esportazione servizi
export {
    getDeviceService,
    getDevicesService,
    postDevicesService,
    patchDevicesService,
    deleteDevicesService,
};
