// Importazione moduli
import bcrypt from 'bcrypt';
import type { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import resHandler from '../utils/responseHandler.js';
import UserModel from '../models/User.model.js';

// Gestore login
async function login(req: Request, res: Response): Promise<Response> {
    // Gestione errori
    try {
        // Ricavo dati richiesta
        const { email, psw } = req.body;

        // Ricavo utente database
        const user = await UserModel.findOne({ email });

        // Controllo utente
        if (!user)
            return resHandler(
                res,
                401,
                null,
                'Email o Password errati!',
                false
            );

        // Controllo email
        if (
            !email ||
            typeof email !== 'string' ||
            !email?.includes('@') ||
            email?.length > 255
        )
            return resHandler(
                res,
                401,
                null,
                'Email o Password errati!',
                false
            );

        // Controllo password
        if (
            !psw ||
            typeof psw !== 'string' ||
            psw?.length < 8 ||
            psw?.length > 255
        )
            return resHandler(
                res,
                401,
                null,
                'Email o Password errati!',
                false
            );

        // Controllo psw
        let pswCheck: boolean = false;
        if (user.psw) {
            pswCheck = await bcrypt.compare(psw, user.psw);
        }
        if (!pswCheck)
            return resHandler(res, 401, null, 'Email o Password errati!');

        // Controllo chiavi
        if (!process.env.JWT_ACCESS || !process.env.JWT_REFRESH)
            return resHandler(
                res,
                500,
                null,
                "Variabili d'ambiente mancanti!",
                false
            );

        // Firma access token
        const accessToken = jwt.sign(
            { id: user._id, email: user.email },
            process.env.JWT_ACCESS,
            { expiresIn: '1h' }
        );

        // Firma refresh token
        const refreshToken = jwt.sign(
            { id: user._id, email: user.email },
            process.env.JWT_REFRESH,
            { expiresIn: '3d' }
        );

        // Salvataggio refresh token
        res.cookie('refreshToken', refreshToken, {
            httpOnly: true,
            maxAge: 7 * 24 * 60 * 1000,
            secure: true,
            sameSite: 'lax',
        });

        // Risposta finale
        return resHandler(
            res,
            200,
            {
                accessToken,
                user: {
                    id: user._id,
                    email: user.email,
                    createdAt: user.createdAt,
                },
            },
            'Login effettuato con successo!',
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
export default login;
