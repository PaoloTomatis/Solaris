// Importazione moduli
import z from 'zod';
import jwt, { type JwtPayload } from 'jsonwebtoken';
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
    info: { ipAddress: string; userAgent: string },
) {
    // Richiesta utente database
    const user = await usersRepository.findOneByEmail(payload.email);

    // Controllo utente
    if (!user) throw new Error('Invalid email or credentials');

    // Controllo password
    const isPswValid = await bcrypt.compare(payload.psw, user.psw);

    // Controllo validazione password
    if (!isPswValid) throw new Error('Invalid email or credentials');

    // Conversione utente
    const parsedUser = dataParser(
        user.toObject(),
        ['psw', 'schemaVersion', '__v'],
        true,
    );

    // Conversione utente minimale
    const minimalParsedUser = dataParser(
        user.toObject(),
        ['email', 'psw', 'schemaVersion', 'updatedAt', 'createdAt', '__v'],
        true,
    );

    // Invalidazione sessioni
    await sessionsRepository.updateMany(user._id, 'revoked');

    // Firma access token
    const accessToken = jwt.sign(
        minimalParsedUser,
        process.env.JWT_ACCESS as string,
        {
            expiresIn: '1h',
        },
    );

    // Firma refresh token
    const refreshToken = jwt.sign(
        minimalParsedUser,
        process.env.JWT_REFRESH as string,
        {
            expiresIn: '3d',
        },
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
    return { accessToken, refreshToken, user: parsedUser };
}

// Servizio post /device-login
async function devicesLoginService(
    payload: z.infer<typeof DevicesLoginBodySchema>,
    info: { ipAddress: string; userAgent: string },
) {
    // Richiesta dispositivo database
    const device = await devicesRepository.findOneByKey(payload.key);

    // Controllo dispositivo
    if (!device) throw new Error('Invalid email or credentials');

    // Controllo password
    const isPswValid = await bcrypt.compare(payload.psw, device.psw);

    // Controllo validazione password
    if (!isPswValid) throw new Error('Invalid email or credentials');

    // Controllo variabili ambiente
    if (!process.env.JWT_ACCESS || !process.env.JWT_REFRESH)
        throw new Error('Sign keys are missing');

    // Conversione dispositivo
    const parsedDevice = dataParser(
        device.toObject(),
        ['key', 'psw', 'schemaVersion', '__v'],
        true,
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
        true,
    );

    // Invalidazione sessioni
    await sessionsRepository.updateMany(device._id, 'revoked');

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
        },
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
    return { accessToken, refreshToken, device: parsedDevice };
}

// Servizio post /user-register
async function usersRegisterService(
    payload: z.infer<typeof UsersRegisterBodySchema>,
) {
    // Richiesta utente database
    const duplicatedUser = await usersRepository.findOneByEmail(payload.email);

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
        true,
    );

    // Ritorno utente
    return parsedUser;
}

// Interfaccia payload
interface JwtPayloadCustom extends JwtPayload {
    id: string;
}

// Servizio post /refresh
async function refreshService(
    info: { ipAddress: string; userAgent: string },
    refreshToken?: string,
) {
    // Controllo refresh token
    if (!refreshToken) throw new Error('Invalid authentication');

    // Validazione refresh token
    const decoded = jwt.verify(
        refreshToken,
        process.env.JWT_REFRESH as string,
    ) as JwtPayloadCustom;

    // Controllo dati
    if (!decoded) throw new Error('Invalid authentication');

    // Richiesta utente database
    const user = await usersRepository.findOneById(decoded.id);

    // Richiesta dispositivo database
    const device = await devicesRepository.findOneById(decoded.id);

    // Controllo soggetto autenticato
    if (user) {
        // Richiesta sessione database
        const [session] = await sessionsRepository.findMany({
            userId: user.id,
            refreshToken,
            status: 'active',
        });

        // Controllo sessione
        if (!session) throw new Error('Invalid authentication');

        // Conversione utente
        const parsedUser = dataParser(
            user.toObject(),
            ['psw', 'schemaVersion', '__v'],
            true,
        );

        // Conversione utente minimale
        const minimalParsedUser = dataParser(
            user.toObject(),
            ['email', 'psw', 'schemaVersion', 'updatedAt', 'createdAt', '__v'],
            true,
        );

        // Firma access token
        const newAccessToken = jwt.sign(
            minimalParsedUser,
            process.env.JWT_ACCESS as string,
            {
                expiresIn: '1h',
            },
        );

        // Firma refresh token
        const newRefreshToken = jwt.sign(
            minimalParsedUser,
            process.env.JWT_REFRESH as string,
            {
                expiresIn: '3d',
            },
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
        return {
            accessToken: newAccessToken,
            refreshToken: newRefreshToken,
            user: parsedUser,
        };
    } else if (device) {
        // Richiesta sessione database
        const [session] = await sessionsRepository.findMany({
            deviceId: device.id,
            refreshToken,
            status: 'active',
        });

        // Controllo sessione
        if (!session) throw new Error('Invalid authentication');

        // Conversione dispositivo
        const parsedDevice = dataParser(
            device.toObject(),
            ['key', 'psw', 'schemaVersion', '__v'],
            true,
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
            true,
        );

        // Firma access token
        const newAccessToken = jwt.sign(
            minimalParsedDevice,
            process.env.JWT_ACCESS as string,
            {
                expiresIn: '1h',
            },
        );

        // Firma refresh token
        const newRefreshToken = jwt.sign(
            minimalParsedDevice,
            process.env.JWT_REFRESH as string,
            {
                expiresIn: '3d',
            },
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
        return { accessToken: newAccessToken, device: parsedDevice };
    } else throw new Error('Invalid authentication');
}

// Servizio post /logout
async function logoutService(
    refreshToken?: string,
    user?: UserType,
    device?: DeviceType,
) {
    // Controllo refresh token
    if (!refreshToken) return null;

    // Controllo soggetto autenticato
    if (user) {
        // Richiesta sessione database
        const [session] = await sessionsRepository.findMany({
            userId: user.id,
            refreshToken,
            status: 'active',
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
            status: 'active',
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
