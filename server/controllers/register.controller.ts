// Importazione moduli
import bcrypt from 'bcrypt';
import type { Request, Response } from 'express';
import resHandler from '../utils/responseHandler.js';
import UserModel from '../models/User.model.js';

// Gestore login
async function register(req: Request, res: Response): Promise<Response> {
    // Gestione errori
    try {
        // Ricavo dati richiesta
        const { email, psw } = req.body;

        // Controllo email
        if (
            !email ||
            typeof email !== 'string' ||
            /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/.test(email)
        )
            return resHandler(res, 400, null, "L'Email è invalida!", false);

        // Controllo password
        if (
            !psw ||
            typeof psw !== 'string' ||
            /^(?=.*\d)(?=.*[^a-zA-Z0-9]).{8,255}$/.test(psw)
        )
            return resHandler(
                res,
                400,
                null,
                'La Password deve essere lunga almeno 8 caratteri, deve contenere un numero e un carattere speciale!',
                false
            );

        // Ricavo utente database
        const dupUser = await UserModel.findOne({ email });

        // Controllo doppione utente
        if (dupUser)
            return resHandler(res, 409, null, 'Account già esistente!', false);

        // Hash password
        const pswHash = await bcrypt.hash(psw, 10);

        // Creazione utente
        const user = new UserModel({
            email,
            psw: pswHash,
            refreshToken: '',
            createdAt: new Date().toISOString(),
        });

        // Salvataggio utente
        await user.save();

        // Ricavo utente database
        const userRes = await UserModel.findOne({ email });

        // Controllo utente
        if (!userRes)
            return resHandler(
                res,
                400,
                null,
                "L'utente non è stato registrato correttamente!",
                false
            );

        // Risposta finale
        return resHandler(
            res,
            201,
            {
                user: {
                    id: userRes._id,
                    email: userRes.email,
                    createdAt: userRes.createdAt,
                },
            },
            'Registrazione effettuata con successo!',
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
export default register;
