// Importazione moduli
import type { Request, Response } from 'express';
import type { JwtPayload } from 'jsonwebtoken';
import jwt from 'jsonwebtoken';
import resHandler from '../../global/utils/responseHandler.js';
import UserModel from '../models/User.model.js';

// Interfaccia payload
interface JwtPayloadCustom extends JwtPayload {
    id: string;
    email: string;
}

// Gestore refresh
async function refresh(req: Request, res: Response): Promise<Response> {
    // Gestione errori
    try {
        // Ricavo dati richiesta
        const refreshToken: string | undefined = req.cookies.refreshToken;

        if (!refreshToken)
            return resHandler(
                res,
                400,
                null,
                'Token di autenticazione mancante!',
                false
            );

        // Ricavo utente database
        const user = await UserModel.findOne({ refreshToken });

        // Controllo utente
        if (!user)
            return resHandler(
                res,
                401,
                null,
                'Token di autenticazione invalido!',
                false
            );

        // Controllo chiavi
        if (!process.env.JWT_REFRESH || !process.env.JWT_ACCESS)
            return resHandler(
                res,
                500,
                null,
                "Variabili d'ambiente mancanti!",
                false
            );

        // Verifica refresh token
        const decoded = jwt.verify(
            refreshToken,
            process.env.JWT_REFRESH
        ) as JwtPayloadCustom;
        if (!decoded)
            return resHandler(
                res,
                401,
                null,
                'Token di autenticazione invalido!',
                false
            );

        // Controllo dati utente e decoded
        if (decoded.id !== user._id.toString() || decoded.email !== user.email)
            return resHandler(
                res,
                401,
                null,
                'Token di autenticazione invalido!',
                false
            );

        // Firma access token
        const accessToken = jwt.sign(
            {
                id: user._id,
                email: user.email,
                role: user.role,
                updatedAt: user.updatedAt,
                createdAt: user.createdAt,
            },
            process.env.JWT_ACCESS,
            { expiresIn: '1h' }
        );

        // Risposta finale
        return resHandler(
            res,
            200,
            {
                accessToken,
                user: {
                    id: user._id,
                    email: user.email,
                    role: user.role,
                    updatedAt: user.updatedAt,
                    createdAt: user.createdAt,
                },
            },
            'Aggiornamento token di autenticazione effettuato correttamente!',
            true
        );
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

// Esportazione gestore
export default refresh;
