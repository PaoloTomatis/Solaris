// Importazione moduli
import jwt from 'jsonwebtoken';
import type { JwtPayload } from 'jsonwebtoken';
import type { Request, Response, NextFunction } from 'express';
import resHandler from '../utils/responseHandler.js';
import UserModel from '../models/User.model.js';

// Interfaccia payload
interface JwtPayloadCustom extends JwtPayload {
    id: string;
    email: string;
}

// Middleware verifica token
async function jwtVerify(
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

        // Controllo chiave
        if (!process.env.JWT_ACCESS)
            return resHandler(
                res,
                500,
                null,
                "Variabili d'ambiente mancanti!",
                false
            );

        // Controllo token
        const decoded = jwt.verify(
            accessToken,
            process.env.JWT_ACCESS
        ) as JwtPayloadCustom;

        // Controllo dati
        if (!decoded)
            return resHandler(
                res,
                401,
                null,
                'Token di autenticazione invalido!',
                false
            );

        // Ricavo utente database
        const user = await UserModel.findOne({ id: decoded.id });

        // Controllo esistenza utente
        if (!user)
            return resHandler(
                res,
                401,
                null,
                'Token di autenticazione invalido!',
                false
            );

        // Impostazione utente
        req.body.user = {
            id: user._id,
            email: user.email,
            role: user.role,
            createdAt: user.createdAt,
        };

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

// Esportazione middleware
export default jwtVerify;
