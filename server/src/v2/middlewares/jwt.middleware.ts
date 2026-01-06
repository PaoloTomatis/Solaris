// Importazione moduli
import jwt from 'jsonwebtoken';
import type { JwtPayload } from 'jsonwebtoken';
import type { Request, Response, NextFunction } from 'express';
import type { AuthenticatedWS, DeviceType, UserType } from '../types/types.js';
import usersRepository from '../repositories/users.repository.js';
import devicesRepository from '../repositories/devices.repository.js';
import dataParser from '../utils/dataParser.js';
import type { IncomingMessage } from 'http';
import { AuthMiddlewareSchema } from '../schemas/Authentication.schema.js';

// Interfaccia payload
interface JwtPayloadCustom extends JwtPayload {
    id: string;
    email: string;
}

// Firma utente
async function jwtVerify(accessToken: string, type: 'user'): Promise<UserType>;

// Firma dispositivo
async function jwtVerify(
    accessToken: string,
    type: 'device'
): Promise<DeviceType>;

// Funzione verifica token
async function jwtVerify(
    accessToken: string,
    type: 'user' | 'device'
): Promise<UserType | DeviceType> {
    // Controllo token
    const decoded = jwt.verify(
        accessToken,
        process.env.JWT_ACCESS as string
    ) as JwtPayloadCustom;

    //TODO Errore custom
    // Controllo dati
    if (!decoded) throw new Error('Invalid authentication');

    if (type === 'user') {
        // Ricavo utente database
        const user = await usersRepository.findOneById(decoded.id);

        //TODO Errore custom
        // Controllo esistenza soggetto
        if (!user) throw new Error('Invalid authentication');

        // Conversione utente
        const parsedUser = dataParser(
            user.toObject(),
            ['psw', 'schemaVersion'],
            true
        );

        // Ritorno
        return parsedUser;
    } else {
        // Ricavo utente database
        const device = await devicesRepository.findOneById(decoded.id);

        //TODO Errore custom
        // Controllo esistenza soggetto
        if (!device) throw new Error('Invalid authentication');

        // Conversione utente
        const parsedDevice = dataParser(
            device.toObject(),
            ['psw', 'key', 'schemaVersion'],
            true
        );

        // Ritorno
        return parsedDevice;
    }
}

async function jwtMiddlewareRest(
    req: Request,
    res: Response,
    next: NextFunction
): Promise<void | Response> {
    // Gestione errori
    try {
        // Ricavo dati richiesta
        const accessTokenRes = req.headers.authorization;
        const accessToken = accessTokenRes?.split(' ')[1] || null;
        const type = req.query?.authType;

        // Conversione dati
        const data = AuthMiddlewareSchema.parse({ accessToken, type });

        // Controllo tipo autenticazione
        if (type === 'user') {
            // Impostazione utente
            req.user = await jwtVerify(data.accessToken, 'user');
        } else {
            // Impostazione dispositivo
            req.device = await jwtVerify(data.accessToken, 'device');
        }

        // Passaggio prossimo gestore
        next();
    } catch (error) {
        next(error);
    }
}

async function jwtMiddlewareWS(ws: AuthenticatedWS, req: IncomingMessage) {
    // Gestione errori
    try {
        // Ricavo dati richiesta
        const url = new URL(req.url ?? '', `http://${req.headers.host}`);
        const accessToken = url.searchParams.get('token');
        const type = url.searchParams.get('authType');

        // Conversione dati
        const data = AuthMiddlewareSchema.parse({ accessToken, type });

        if (type === 'user') {
            // Impostazione utente
            ws.user = await jwtVerify(data.accessToken, 'user');
        } else {
            // Impostazione utente
            ws.device = await jwtVerify(data.accessToken, 'device');
        }
    } catch (error: unknown) {
        // Errore in console
        console.error(error);
        const errorMsg =
            error instanceof Error
                ? error?.message || 'Errore interno del server!'
                : 'Errore sconosciuto!';
        // Risposta finale
        ws.send(JSON.stringify({ error: errorMsg }));
        ws.close(4001, errorMsg);
    }
}

// Esportazione middleware
export { jwtMiddlewareRest, jwtMiddlewareWS };
