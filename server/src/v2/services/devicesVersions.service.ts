// Importazione moduli
import type { DeviceType, UserType } from '../types/types.js';
import z from 'zod';
import devicesRepository from '../repositories/devices.repository.js';
import usersRepository from '../repositories/users.repository.js';
import dataParser from '../utils/dataParser.js';
import type {
    GetDevicesVersionsDeviceQuerySchema,
    GetDevicesVersionsParamsSchema,
    GetDevicesVersionsUserQuerySchema,
    PostDevicesVersionsBodySchema,
    PostDevicesVersionsInstallBodySchema,
} from '../schemas/DevicesVersions.schema.js';
import devicesVersionsRepository from '../repositories/devicesVersions.repository.js';
import devicesSettingsRepository from '../repositories/devicesSettings.repository.js';

// Servizio get /devices-versions/user
async function getDevicesVersionsUserService(
    payload: z.infer<typeof GetDevicesVersionsUserQuerySchema>,
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

    // Richiesta versioni dispositivo database
    const devicesVersions = await devicesVersionsRepository.findMany({
        sort: payload.sort,
        limit: payload.limit,
        channel: payload.channel,
        from: payload.from,
        to: payload.to,
        prototypeModel: device.prototypeModel,
    });

    // Controllo versioni dispositivo
    if (!devicesVersions) throw new Error('Device version not found');

    // Conversione versioni dispositivo
    const parsedDevicesVersions = devicesVersions.map((deviceVersion) => {
        return dataParser(deviceVersion, ['__v', 'schemaVersion'], true);
    });

    // Ritorno versioni dispositivo
    return parsedDevicesVersions;
}

// Servizio get /devices-versions/:id
async function getDevicesVersionsByIdService(
    { id }: z.infer<typeof GetDevicesVersionsParamsSchema>,
    user?: UserType,
) {
    // Controllo utente
    if (!user) throw new Error('Invalid authentication');

    // Richiesta versione dispositivo database
    const deviceVersion = await devicesVersionsRepository.findOne(id);

    // Controllo versione dispositivo
    if (!deviceVersion) throw new Error('Device version not found');

    // Richiesta dispositivo database
    const device = await devicesRepository.findOne({
        prototypeModel: deviceVersion.prototypeModel,
        userId: user.id,
    });

    // Controllo dispositivo
    if (!device) throw new Error('Device version not found');

    // Conversione versione dispositivo
    const parsedDeviceVersion = dataParser(
        deviceVersion,
        ['__v', 'schemaVersion'],
        true,
    );

    // Ritorno versione dispositivo
    return parsedDeviceVersion;
}

// Servizio get /devices-versions/device
async function getDevicesVersionsDeviceService(
    payload: z.infer<typeof GetDevicesVersionsDeviceQuerySchema>,
    device?: DeviceType,
) {
    // Controllo dispositivo
    if (!device) throw new Error('Invalid authentication');

    // Controllo id utente
    if (!device.userId) throw new Error('The device must be owned by a user');

    // Richiesta utente database
    const user = await usersRepository.findOneById(device.userId);

    // Controllo utente
    if (!user) throw new Error('The device must be owned by a user');

    // Richiesta versione dispositivo database
    const deviceVersion = await devicesVersionsRepository.findLatest({
        ...payload,
        prototypeModel: device.prototypeModel,
    });

    // Controllo versione dispositivo
    if (!deviceVersion) throw new Error('Device version not found');

    // Conversione versione dispositivo
    const parsedDeviceVersion = dataParser(
        deviceVersion,
        ['__v', 'schemaVersion'],
        true,
    );

    // Lettura codice
    const code = await devicesVersionsRepository.read(deviceVersion.filepath);

    // Controllo codice
    if (!code) throw new Error('Code not found');

    // Ritorno versione dispositivo
    return { ...parsedDeviceVersion, code };
}

// Servizio get /devices-versions/check
async function getDevicesVersionsCheckService(device?: DeviceType) {
    // Controllo dispositivo
    if (!device) throw new Error('Invalid authentication');

    // Controllo id utente
    if (!device.userId) throw new Error('The device must be owned by a user');

    // Richiesta utente database
    const user = await usersRepository.findOneById(device.userId);

    // Controllo utente
    if (!user) throw new Error('The device must be owned by a user');

    // Richiesta impostazioni dispositivo database
    const deviceSettings = await devicesSettingsRepository.findOne(device.id);

    // Controllo impostazioni dispositivo
    if (!deviceSettings) throw new Error('Device settings not found');

    // Richiesta versioni dispositivo database
    const deviceVersion = await devicesVersionsRepository.findLatest({
        channel: 'stable',
        prototypeModel: device.prototypeModel,
        mandatory: true,
    });

    // Controllo versioni dispositivo
    if (!deviceVersion) throw new Error('Device version not found');

    // Confronto versioni dispositivo
    if (deviceVersion._id == deviceSettings.firmwareId) return null;

    // Conversione versione dispositivo
    const parsedDeviceVersion = dataParser(
        deviceVersion,
        ['__v', 'schemaVersion'],
        true,
    );

    // Ritorno versione dispositivo
    return parsedDeviceVersion;
}

// Servizio post /devices-versions
async function postDevicesVersionsService(
    { code, ...payload }: z.infer<typeof PostDevicesVersionsBodySchema>,
    user?: UserType,
) {
    // Controllo utente
    if (!user) throw new Error('Invalid authentication');

    // Controllo ruolo utente
    if (user.role !== 'admin')
        throw new Error('The user has to be an admin to perform this action');

    // Richiesta versione dispositivo database
    const duplicatedDeviceVersion = await devicesVersionsRepository.findLatest({
        firmwareVersion: payload.firmwareVersion,
        prototypeModel: payload.prototypeModel,
        channel: payload.channel,
    });

    // Controllo duplicato
    if (duplicatedDeviceVersion)
        throw new Error('The version does already exist');

    // Creazione file
    const filepath = await devicesVersionsRepository.save(payload, code);

    // Creazione versione dispositivo database
    const deviceVersion = await devicesVersionsRepository.createOne({
        ...payload,
        filepath,
    });

    // Conversione versione dispositivo
    const parsedDeviceVersion = dataParser(
        deviceVersion,
        ['schemaVersion', '__v'],
        true,
    );

    // Ritorno versione dispositivo
    return parsedDeviceVersion;
}

// Servizio post /devices-versions/install
async function postDevicesVersionsInstallService(
    {
        deviceId,
        ...payload
    }: z.infer<typeof PostDevicesVersionsInstallBodySchema>,
    user?: UserType,
) {
    // Controllo utente
    if (!user) throw new Error('Invalid authentication');

    // Controllo ruolo utente
    if (user.role !== 'admin')
        throw new Error('The user has to be an admin to perform this action');

    // Richiesta dispositivo database
    const device = await devicesRepository.findOneSafe(deviceId, user.id);

    // Controllo dispositivo
    if (!device)
        throw new Error(
            'The device does not exists or is owned by an other user',
        );

    // Richiesta versione dispositivo database
    const deviceVersion = await devicesVersionsRepository.findLatest({
        ...payload,
        prototypeModel: device.prototypeModel,
    });

    // Controllo versioni dispositivo
    if (!deviceVersion) throw new Error('Device version not found');

    // Aggiornamento impostazioni dispositivo database
    await devicesSettingsRepository.updateOne(
        { firmwareId: deviceVersion._id },
        device._id,
    );

    // Conversione versione dispositivo
    const parsedDeviceVersion = dataParser(
        deviceVersion,
        ['__v', 'schemaVersion'],
        true,
    );

    // Ritorno versione dispositivo
    return parsedDeviceVersion;
}

// Esportazione servizi
export {
    getDevicesVersionsUserService,
    getDevicesVersionsByIdService,
    getDevicesVersionsDeviceService,
    getDevicesVersionsCheckService,
    postDevicesVersionsService,
    postDevicesVersionsInstallService,
};
