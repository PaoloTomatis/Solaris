// Importazione moduli
import jwt from 'jsonwebtoken';
import type { JwtPayload } from 'jsonwebtoken';
import type { Request, Response, NextFunction } from 'express';
import resHandler from '../utils/responseHandler.js';
import UserModel from '../models/User.model.js';
import type { AuthenticatedWS } from '../types/types.js';
import type { UserType } from '../models/User.model.js';
import type { DeviceType } from '../models/Device.model.js';
import DeviceModel from '../models/Device.model.js';
import type { IncomingMessage } from 'http';

// Interfaccia payload
interface JwtPayloadCustom extends JwtPayload {
    id: string;
    email: string;
}

async function jwtVerify(
    accessToken: string,
    type: 'user'
): Promise<{
    id: string;
    email: string;
    role: string;
    createdAt: Date;
    updatedAt: Date;
}>;

async function jwtVerify(
    accessToken: string,
    type: 'device'
): Promise<{
    id: string;
    key: string;
    name: string;
    prototype: string;
    userId: string;
    mode: string;
    activatedAt: Date;
    createdAt: Date;
    updatedAt: Date;
}>;

// Middleware verifica token
async function jwtVerify(accessToken: string, type: 'user' | 'device') {
    // Controllo chiave
    if (!process.env.JWT_ACCESS)
        throw new Error("Variabili d'ambiente mancanti!");

    // Controllo token
    const decoded = jwt.verify(
        accessToken,
        process.env.JWT_ACCESS
    ) as JwtPayloadCustom;

    // Controllo dati
    if (!decoded) throw new Error('Token di autenticazione invalido!');

    // Dichiarazione soggetto
    let subject: UserType | DeviceType | null | undefined;

    if (type === 'user') {
        // Ricavo utente database
        subject = await UserModel.findById(decoded.id);
    } else {
        // Ricavo dispositivo database
        subject = await DeviceModel.findById(decoded.id);
    }

    // Controllo esistenza soggetto
    if (!subject) throw new Error('Token di autenticazione invalido!');

    // Impostazione soggetto
    return (
        type === 'user'
            ? {
                  id: subject._id.toString(),
                  email: (subject as UserType).email,
                  role: (subject as UserType).role,
                  createdAt: subject.createdAt,
                  updatedAt: subject.updatedAt,
              }
            : {
                  id: subject._id.toString(),
                  key: (subject as DeviceType).key,
                  name: (subject as DeviceType).name,
                  prototype: (subject as DeviceType).prototype,
                  userId: (subject as DeviceType).userId?.toString(),
                  mode: (subject as DeviceType).mode,
                  activatedAt: (subject as DeviceType).activatedAt,
                  createdAt: subject.createdAt,
                  updatedAt: subject.updatedAt,
              }
    ) as any;
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
        const accessToken =
            typeof accessTokenRes === 'string'
                ? accessTokenRes.split(' ')[1]
                : null;
        const type = req.body?.type;

        // Controllo access token
        if (!accessToken) {
            return resHandler(
                res,
                400,
                null,
                'Token di autenticazione mancante!',
                false
            );
        }

        if (type === 'user') {
            // Impostazione utente
            req.body.user = await jwtVerify(accessToken, 'user');
        } else {
            // Impostazione dispositivo
            req.body.device = await jwtVerify(accessToken, 'device');
        }

        // Passaggio prossimo gestore
        next();
    } catch (error: unknown) {
        // Errore in console
        console.error(error);
        const errorMsg =
            error instanceof Error
                ? error?.message || 'Errore interno del server!'
                : 'Errore sconosciuto!';
        // Risposta finale
        return resHandler(res, 500, null, errorMsg, false);
    }
}

async function jwtMiddlewareWS(
    ws: AuthenticatedWS,
    req: IncomingMessage
): Promise<AuthenticatedWS> {
    // Gestione errori
    try {
        // Ricavo dati richiesta
        const url = new URL(req.url ?? '', `http://${req.headers.host}`);
        const accessToken = url.searchParams.get('token');
        const type = url.searchParams.get('type');

        // Controllo access token
        if (!accessToken) throw new Error('Token di autenticazione mancante!');

        if (type === 'user') {
            // Impostazione utente
            ws.user = await jwtVerify(accessToken, 'user');
        } else {
            // Impostazione utente
            ws.device = await jwtVerify(accessToken, 'device');
        }

        // Passaggio prossimo gestore
        return ws;
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

        return ws;
    }
}

// Esportazione middleware
export { jwtMiddlewareRest, jwtMiddlewareWS };
