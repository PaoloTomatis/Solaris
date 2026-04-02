// Importazione moduli
import type { DeviceType, UserType } from '../types/types.js';
import z from 'zod';
import devicesRepository from '../repositories/devices.repository.js';
import usersRepository from '../repositories/users.repository.js';
import dataParser from '../utils/dataParser.js';
import type {
    GetDevicesVersionsParamsSchema,
    GetDevicesVersionsQuerySchema,
    GetDevicesVersionsCheckQuerySchema,
    PostDevicesVersionsBodySchema,
    PostDevicesVersionsInstallBodySchema,
} from '../schemas/DevicesVersions.schema.js';
import devicesVersionsRepository from '../repositories/devicesVersions.repository.js';
import devicesSettingsRepository from '../repositories/devicesSettings.repository.js';
import checkVersions from '../utils/versionCheck.js';

// Servizio get /devices-versions
async function getDevicesVersionsService(
    payload: z.infer<typeof GetDevicesVersionsQuerySchema>,
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
    const deviceVersion = await devicesVersionsRepository.findOneById(id);

    // Controllo versione dispositivo
    if (!deviceVersion) throw new Error('Device version not found');

    // Controllo modello prototipo dispositivo
    if (device.prototypeModel !== deviceVersion.prototypeModel)
        throw new Error('Device version not found');

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
async function getDevicesVersionsCheckService(
    payload: z.infer<typeof GetDevicesVersionsCheckQuerySchema>,
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

    // Definizione versione 1
    let fullVersion1: any = null;

    // Controllo id versione 1
    if (!payload.firmwareId1) {
        // Richiesta impostazioni dispositivo database
        const deviceSettings =
            await devicesSettingsRepository.findOneByDeviceId(device.id);

        // Controllo impostazioni dispositivo
        if (!deviceSettings || !deviceSettings?.firmwareId)
            throw new Error('Device settings not found');

        // Richiesta versioni dispositivo database
        const deviceVersion = await devicesVersionsRepository.findOneById(
            deviceSettings?.firmwareId,
        );

        // Controllo impostazioni dispositivo
        if (!deviceVersion) throw new Error('Device version not found');

        // Assegnazione versione 1
        fullVersion1 = deviceVersion;
    } else {
        // Richiesta versioni dispositivo database
        const deviceVersion = await devicesVersionsRepository.findOneById(
            payload.firmwareId1,
        );

        // Controllo impostazioni dispositivo
        if (!deviceVersion) throw new Error('Device version not found');

        // Assegnazione versione 1
        fullVersion1 = deviceVersion;
    }

    // Definizione versione 2
    let fullVersion2: any = null;

    // Controllo id versione 2
    if (!payload.firmwareId2) {
        // Richiesta versioni dispositivo database
        const deviceVersion = await devicesVersionsRepository.findLatest({
            prototypeModel: device.prototypeModel,
            channel: 'stable',
        });

        // Controllo impostazioni dispositivo
        if (!deviceVersion) throw new Error('Device version not found');

        // Assegnazione versione 2
        fullVersion2 = deviceVersion;
    } else {
        // Richiesta versioni dispositivo database
        const deviceVersion = await devicesVersionsRepository.findOneById(
            payload.firmwareId2,
        );

        // Controllo impostazioni dispositivo
        if (!deviceVersion) throw new Error('Device version not found');

        // Assegnazione versione 2
        fullVersion2 = deviceVersion;
    }

    // Confronto versioni dispositivo
    if (
        checkVersions(
            fullVersion1.firmwareVersion,
            fullVersion2.firmwareVersion,
        )
    ) {
        // Conversione versione dispositivo
        const parsedDeviceVersion = dataParser(
            fullVersion1,
            ['__v', 'schemaVersion'],
            true,
        );

        // Ritorno versione dispositivo
        return parsedDeviceVersion;
    } else {
        // Conversione versione dispositivo
        const parsedDeviceVersion = dataParser(
            fullVersion2,
            ['__v', 'schemaVersion'],
            true,
        );

        // Ritorno versione dispositivo
        return parsedDeviceVersion;
    }
}

// Servizio get /devices-versions/check
async function getDevicesVersionsLatestService(device?: DeviceType) {
    // Controllo dispositivo
    if (!device) throw new Error('Invalid authentication');

    // Controllo id utente
    if (!device.userId) throw new Error('The device must be owned by a user');

    // Richiesta utente database
    const user = await usersRepository.findOneById(device.userId);

    // Controllo utente
    if (!user) throw new Error('The device must be owned by a user');

    // Richiesta versioni dispositivo database
    const deviceVersion = await devicesVersionsRepository.findLatest({
        prototypeModel: device.prototypeModel,
        channel: 'stable',
    });

    // Controllo versioni dispositivo
    if (!deviceVersion) throw new Error('Device version not found');

    // Conversione versione dispositivo
    const parsedDeviceVersion = dataParser(
        deviceVersion,
        ['schemaVersion', '__v'],
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
    const filepath = await devicesVersionsRepository.createFilepath(payload);

    // Creazione versione dispositivo database
    const deviceVersion = await devicesVersionsRepository.createOne({
        ...payload,
        filepath,
    });

    // Definizione codice totale
    const fullCode =
        (code += `\ndef getCurrentVersion(): \n\treturn "${deviceVersion._id}"`);

    // Sovrascrittura file
    await devicesVersionsRepository.save(filepath, { code: fullCode });

    // Controllo obbligatorietà
    if (payload.mandatory) {
        // Aggiornamento impostazioni dispositivi database
        await devicesSettingsRepository.updateManyByPrototypeModel(
            payload.prototypeModel,
            { firmwareId: deviceVersion._id },
        );
    }

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
    const deviceSettings = await devicesSettingsRepository.updateOneByDeviceId(
        device._id,
        {
            firmwareId: deviceVersion._id,
        },
    );

    // Controllo impostazioni dispositivo
    if (!deviceSettings) throw new Error('Update of device settings failed');

    // Conversione impostazioni dispositivo
    const parsedDeviceSettings = dataParser(
        deviceSettings,
        ['__v', 'schemaVersion'],
        true,
    );

    // Ritorno versione dispositivo
    return parsedDeviceSettings;
}

// Esportazione servizi
export {
    getDevicesVersionsService,
    getDevicesVersionsByIdService,
    getDevicesVersionsCheckService,
    getDevicesVersionsLatestService,
    postDevicesVersionsService,
    postDevicesVersionsInstallService,
};
