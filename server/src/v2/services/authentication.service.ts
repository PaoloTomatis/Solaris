// Importazione moduli
import z from 'zod';
import jwt from 'jsonwebtoken';
import type {
    DevicesLoginBodySchema,
    UsersLoginBodySchema,
    UsersRegisterBodySchema,
} from '../schemas/Authentication.schema.js';
import usersRepository from '../repositories/users.repository.js';
import bcrypt from 'bcrypt';
import dataParser from '../utils/dataParser.js';
import sessionsRepository from '../repositories/sessions.repository.js';
import devicesRepository from '../repositories/devices.repository.js';
import type { DeviceType, UserType } from '../types/types.js';

// Servizio post /user-login
async function usersLoginService(
    payload: z.infer<typeof UsersLoginBodySchema>,
    info: { ipAddress: string; userAgent: string }
) {
    // Richiesta utente database
    const user = await usersRepository.findOneByEmail(payload.email);

    //TODO Errore custom
    // Controllo utente
    if (!user) throw new Error('Invalid email or credentials');

    // Controllo password
    const isPswValid = await bcrypt.compare(payload.psw, user.psw);

    //TODO Errore custom
    // Controllo validazione password
    if (!isPswValid) throw new Error('Invalid email or credentials');

    // Conversione utente
    const parsedUser = dataParser(
        user.toObject(),
        ['psw', 'schemaVersion', '__v'],
        true
    );

    // Conversione utente minimale
    const minimalParsedUser = dataParser(
        user.toObject(),
        ['email', 'psw', 'schemaVersion', 'updatedAt', 'createdAt', '__v'],
        true
    );

    // Richiesta sessione database
    const sessions = await sessionsRepository.findManyByIp(
        info.ipAddress,
        'active'
    );

    // Iterazione sessioni
    sessions.forEach(async (session) => {
        // Invalidazione sessione
        await sessionsRepository.updateOne('revoked', session.id);
    });

    // Firma access token
    const accessToken = jwt.sign(
        minimalParsedUser,
        process.env.JWT_ACCESS as string,
        {
            expiresIn: '1h',
        }
    );

    // Firma refresh token
    const refreshToken = jwt.sign(
        minimalParsedUser,
        process.env.JWT_REFRESH as string,
        {
            expiresIn: '3d',
        }
    );

    // Creazione sessione database
    await sessionsRepository.createOne({
        userId: user._id,
        subject: 'user',
        refreshToken,
        ipAddress: info.ipAddress,
        userAgent: info.userAgent,
        status: 'active',
    });

    // Ritorno access token e utente
    return { accessToken, user: parsedUser };
}

// Servizio post /device-login
async function devicesLoginService(
    payload: z.infer<typeof DevicesLoginBodySchema>,
    info: { ipAddress: string; userAgent: string }
) {
    // Richiesta dispositivo database
    const device = await devicesRepository.findOneByKey(payload.key);

    //TODO Errore custom
    // Controllo dispositivo
    if (!device) throw new Error('Invalid email or credentials');

    // Controllo password
    const isPswValid = await bcrypt.compare(payload.psw, device.psw);

    //TODO Errore custom
    // Controllo validazione password
    if (!isPswValid) throw new Error('Invalid email or credentials');

    //TODO Errore custom
    // Controllo variabili ambiente
    if (!process.env.JWT_ACCESS || !process.env.JWT_REFRESH)
        throw new Error('Sign keys are missing');

    // Conversione dispositivo
    const parsedDevice = dataParser(
        device.toObject(),
        ['key', 'psw', 'schemaVersion', '__v'],
        true
    );

    // Conversione dispositivo minimale
    const minimalParsedDevice = dataParser(
        device.toObject(),
        [
            'key',
            'name',
            'psw',
            'prototypeModel',
            'schemaVersion',
            'activatedAt',
            'updatedAt',
            'createdAt',
            '__v',
        ],
        true
    );

    // Richiesta sessione database
    const sessions = await sessionsRepository.findManyByIp(
        info.ipAddress,
        'active'
    );

    // Iterazione sessioni
    sessions.forEach(async (session) => {
        // Invalidazione sessione
        await sessionsRepository.updateOne('revoked', session.id);
    });

    // Firma access token
    const accessToken = jwt.sign(minimalParsedDevice, process.env.JWT_ACCESS, {
        expiresIn: '1h',
    });

    // Firma refresh token
    const refreshToken = jwt.sign(
        minimalParsedDevice,
        process.env.JWT_REFRESH,
        {
            expiresIn: '3d',
        }
    );

    // Creazione sessione database
    await sessionsRepository.createOne({
        deviceId: device._id,
        subject: 'device',
        refreshToken,
        ipAddress: info.ipAddress,
        userAgent: info.userAgent,
        status: 'active',
    });

    // Ritorno access token e dispositivo
    return { accessToken, device: parsedDevice };
}

// Servizio post /user-register
async function usersRegisterService(
    payload: z.infer<typeof UsersRegisterBodySchema>
) {
    // Richiesta utente database
    const duplicatedUser = await usersRepository.findOneByEmail(payload.email);

    //TODO Errore custom
    // Controllo dispositivo
    if (duplicatedUser) throw new Error('Invalid email or credentials');

    // Controllo password
    const pswHash = await bcrypt.hash(payload.psw, 10);

    // Creazione utente database
    const user = await usersRepository.createOne({ ...payload, psw: pswHash });

    // Conversione utente
    const parsedUser = dataParser(
        user.toObject(),
        ['psw', 'schemaVersion', '__v'],
        true
    );

    // Ritorno utente
    return parsedUser;
}

// Servizio post /refresh
async function refreshService(
    info: { ipAddress: string; userAgent: string },
    refreshToken?: string,
    user?: UserType,
    device?: DeviceType
) {
    //TODO Errore custom
    // Controllo refresh token
    if (!refreshToken) throw new Error('Invalid authentication');

    //TODO Errore custom
    // Controllo soggetto autenticato
    if (user) {
        // Richiesta sessione database
        const [session] = await sessionsRepository.findMany({
            userId: user.id,
            refreshToken,
            type: 'active',
        });

        //TODO Errore custom
        // Controllo sessione
        if (!session) throw new Error('Invalid authentication');

        // Conversione utente minimale
        const minimalParsedUser = dataParser(user, [
            'email',
            'updatedAt',
            'createdAt',
        ]);

        // Firma access token
        const newAccessToken = jwt.sign(
            minimalParsedUser,
            process.env.JWT_ACCESS as string,
            {
                expiresIn: '1h',
            }
        );

        // Firma refresh token
        const newRefreshToken = jwt.sign(
            minimalParsedUser,
            process.env.JWT_REFRESH as string,
            {
                expiresIn: '3d',
            }
        );

        // Aggiornamento sessione database
        await sessionsRepository.updateOne('revoked', session._id);

        // Creazione sessione database
        await sessionsRepository.createOne({
            userId: user.id,
            subject: 'user',
            refreshToken: newRefreshToken,
            ipAddress: info.ipAddress,
            userAgent: info.userAgent,
            status: 'active',
        });

        // Ritorno access token e utente
        return { accessToken: newAccessToken, user };
    } else if (device) {
        // Richiesta sessione database
        const [session] = await sessionsRepository.findMany({
            deviceId: device.id,
            refreshToken,
            type: 'active',
        });

        //TODO Errore custom
        // Controllo sessione
        if (!session) throw new Error('Invalid authentication');

        // Conversione dispositivo minimale
        const minimalParsedDevice = dataParser(device, [
            'name',
            'prototypeModel',
            'activatedAt',
            'updatedAt',
            'createdAt',
        ]);

        // Firma access token
        const newAccessToken = jwt.sign(
            minimalParsedDevice,
            process.env.JWT_ACCESS as string,
            {
                expiresIn: '1h',
            }
        );

        // Firma refresh token
        const newRefreshToken = jwt.sign(
            minimalParsedDevice,
            process.env.JWT_REFRESH as string,
            {
                expiresIn: '3d',
            }
        );

        // Aggiornamento sessione database
        await sessionsRepository.updateOne('revoked', session._id);

        // Creazione sessione database
        await sessionsRepository.createOne({
            deviceId: device.id,
            subject: 'device',
            refreshToken: newRefreshToken,
            ipAddress: info.ipAddress,
            userAgent: info.userAgent,
            status: 'active',
        });

        // Ritorno access token e dispositivo
        return { accessToken: newAccessToken, device };
    } else throw new Error('Invalid authentication');
}

// Servizio post /logout
async function logoutService(
    refreshToken?: string,
    user?: UserType,
    device?: DeviceType
) {
    // Controllo refresh token
    if (!refreshToken) return null;

    // Controllo soggetto autenticato
    if (user) {
        // Richiesta sessione database
        const [session] = await sessionsRepository.findMany({
            userId: user.id,
            refreshToken,
            type: 'active',
        });

        // Controllo sessione
        if (!session) return null;

        // Aggiornamento sessione database
        await sessionsRepository.updateOne('revoked', session._id);
    } else if (device) {
        // Richiesta sessione database
        const [session] = await sessionsRepository.findMany({
            deviceId: device.id,
            refreshToken,
            type: 'active',
        });

        // Controllo sessione
        if (!session) return null;

        // Aggiornamento sessione database
        await sessionsRepository.updateOne('revoked', session._id);
    }

    // Ritorno null
    return null;
}

// Esportazione servizi
export {
    usersLoginService,
    devicesLoginService,
    usersRegisterService,
    refreshService,
    logoutService,
};
