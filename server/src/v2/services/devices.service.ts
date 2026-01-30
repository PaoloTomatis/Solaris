// Importazione moduli
import { v4 } from 'uuid';
import type { UserType } from '../types/types.js';
import devicesRepository from '../repositories/devices.repository.js';
import { hash } from 'bcrypt';
import pswGenerator from '../../global/utils/pswGenerator.js';
import z from 'zod';
import {
    GetDevicesQuerySchema,
    PatchDeviceActivateParamsSchema,
    PatchDevicesActivateBodySchema,
    PatchDevicesBodySchema,
    PatchDevicesParamsSchema,
    PostDevicesBodySchema,
} from '../schemas/Devices.schema.js';
import dataParser from '../utils/dataParser.js';

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
            "The device does not exists or the user isn't allowed to get it",
        );

    // Conversione dispositivo
    const parsedDevice = dataParser(
        device.toObject(),
        ['key', 'psw', 'schemaVersion', '__v'],
        true,
    );

    // Ritorno dispositivo
    return parsedDevice;
}

// Servizio get /devices
async function getDevicesService(
    payload: z.infer<typeof GetDevicesQuerySchema>,
    user?: UserType,
) {
    //TODO Errore custom
    // Controllo utente
    if (!user) throw new Error('Invalid authentication');

    // Richiesta dispositivi
    const devices = await devicesRepository.findManySafe(payload, user);

    // Iterazione dispositivi
    const parsedDevices = devices.map((device) => {
        // Conversione dispositivo
        return dataParser(
            device.toObject(),
            ['key', 'psw', 'schemaVersion', '__v'],
            true,
        );
    });

    // Ritorno dispositivi
    return parsedDevices;
}

// Servizio post /devices
async function postDevicesService(
    body: z.infer<typeof PostDevicesBodySchema>,
    user?: UserType,
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
    let psw = body.psw ?? pswGenerator(15, true);

    // Conversione psw
    psw = await hash(psw, 10);

    // Richiesta dispositivo
    const device = await devicesRepository.createOne({ ...body, psw, key });

    //TODO Errore custom
    // Controllo dispositivo
    if (!device) throw new Error('Creation of the device failed');

    // Conversione dispositivo
    const parsedDevice = dataParser(
        device.toObject(),
        ['key', 'psw', 'schemaVersion', '__v'],
        true,
    );

    // Ritorno dispositivo
    return parsedDevice;
}

// Servizio patch /devices/activate/:key
async function patchDevicesActivateService(
    { key }: z.infer<typeof PatchDeviceActivateParamsSchema>,
    { name }: z.infer<typeof PatchDevicesActivateBodySchema>,
    user?: UserType,
) {
    //TODO Errore custom
    // Controllo utente
    if (!user) throw new Error('Invalid authentication');

    // Richiesta dispositivo
    const device = await devicesRepository.findOneByKey(key);

    //TODO Errore custom
    // Controllo device
    if (!device || device.userId)
        throw new Error(
            'The device does not exists or is owned by an other user',
        );

    // Modifica dispositivo
    const newDevice = await devicesRepository.updateOne(device.id, {
        userId: user.id,
        name,
    });

    //TODO Errore custom
    // Controllo nuovo device
    if (!newDevice) throw new Error('Activation failed');

    // Conversione dispositivo
    const parsedDevice = dataParser(
        newDevice.toObject(),
        ['key', 'psw', 'schemaVersion', '__v'],
        true,
    );

    // Ritorno dispositivo
    return parsedDevice;
}

// Servizio patch /devices/:deviceId
async function patchDevicesService(
    body: z.infer<typeof PatchDevicesBodySchema>,
    { deviceId }: z.infer<typeof PatchDevicesParamsSchema>,
    user?: UserType,
) {
    //TODO Errore custom
    // Controllo utente
    if (!user) throw new Error('Invalid authentication');

    // Modifica dispositivo
    const newDevice = await devicesRepository.updateOneSafe(
        deviceId,
        user.id,
        body,
    );

    //TODO Errore custom
    // Controllo nuovo device
    if (!newDevice)
        throw new Error(
            "The device does not exists or the user isn't allowed to modify it",
        );

    // Conversione dispositivo
    const parsedDevice = dataParser(
        newDevice.toObject(),
        ['key', 'psw', 'schemaVersion', '__v'],
        true,
    );

    // Ritorno dispositivo
    return parsedDevice;
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

    // Conversione dispositivo
    const parsedDevice = dataParser(
        oldDevice.toObject(),
        ['key', 'psw', 'schemaVersion', '__v'],
        true,
    );

    // Ritorno dispositivo
    return parsedDevice;
}

// Esportazione servizi
export {
    getDeviceService,
    getDevicesService,
    postDevicesService,
    patchDevicesActivateService,
    patchDevicesService,
    deleteDevicesService,
};
