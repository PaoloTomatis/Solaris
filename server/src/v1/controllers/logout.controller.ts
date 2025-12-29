// Importazione moduli
import type { Request, Response } from 'express';
import type { JwtPayload } from 'jsonwebtoken';
import resHandler from '../../global/utils/responseHandler.js';
import UserModel from '../models/User.model.js';

// Gestore logout
async function logout(req: Request, res: Response): Promise<Response> {
    // Gestione errori
    try {
        // Ricavo dati richiesta
        const refreshToken: string | undefined = req.cookies.refreshToken;

        if (!refreshToken)
            return resHandler(
                res,
                200,
                null,
                'Logout avvenuto correttamente (token autenticazione assente)!',
                true
            );

        // Cancellazione cookie
        res.clearCookie('refreshToken', {
            httpOnly: true,
            secure: true,
            maxAge: 7 * 24 * 60 * 1000,
            sameSite: 'lax',
        });

        // Ricavo utente database
        const user = await UserModel.findOne({ refreshToken });

        // Controllo utente
        if (!user)
            return resHandler(
                res,
                200,
                null,
                'Logout avvenuto correttamente (token autenticazione invalido)!',
                true
            );

        // Aggiornamento utente database
        await UserModel.updateOne({ refreshToken }, { refreshToken: null });

        // Risposta finale
        return resHandler(
            res,
            200,
            {
                user: {
                    id: user._id,
                    email: user.email,
                    role: user.role,
                    updatedAt: user.updatedAt,
                    createdAt: user.createdAt,
                },
            },
            'Logout avvenuto correttamente!',
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
export default logout;
