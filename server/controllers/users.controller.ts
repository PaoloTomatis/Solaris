// Importazione moduli
import type { Request, Response } from 'express';
import resHandler from '../utils/responseHandler.js';
import UserModel from '../models/User.model.js';
import bcrypt from 'bcrypt';
import type { UserType } from '../types/types.js';

// Gestore get user
async function getUser(req: Request, res: Response): Promise<Response> {
    // Gestione errori
    try {
        // Ricavo dati richiesta
        const user: UserType | undefined = req.body.user;

        // Controllo utente
        if (!user)
            return resHandler(
                res,
                401,
                null,
                'Autenticazione non eseguita correttamente!',
                false
            );

        // Ricavo utente database
        const userRes = await UserModel.findOne({ _id: user.id });

        // Controllo utente
        if (!userRes)
            return resHandler(res, 404, null, 'Utente non esistente!', false);

        // Risposta finale
        return resHandler(
            res,
            200,
            {
                id: userRes._id.toString(),
                role: userRes.role,
                email: userRes.email,
                createdAt: userRes.createdAt,
                updatedAt: userRes.updatedAt,
            },
            'Utente ricavato con successo!',
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

// Gestore patch user
async function patchUser(req: Request, res: Response): Promise<Response> {
    // Gestione errori
    try {
        // Ricavo dati richiesta
        const user: UserType | undefined = req.body.user;
        const { email, psw }: { email?: string; psw?: string } = req.body;

        // Lista modifiche
        const data: { email?: string; psw?: string } = {};

        // Controllo utente
        if (!user)
            return resHandler(
                res,
                401,
                null,
                'Autenticazione non eseguita correttamente!',
                false
            );

        // Controllo email
        if (
            email &&
            typeof email == 'string' &&
            /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/.test(email)
        ) {
            // Controllo possessione email
            if (user.email !== email) {
                // Ricavo utente database
                const dupUser = await UserModel.findOne({ email });

                // Controllo doppione utente
                if (dupUser)
                    return resHandler(
                        res,
                        400,
                        null,
                        "L'Email selezionata è già in uso!",
                        false
                    );

                data.email = email;
            }
        }

        // Controllo password
        if (
            psw &&
            typeof psw == 'string' &&
            /^(?=.*\d)(?=.*[^a-zA-Z0-9]).{8,255}$/.test(psw)
        ) {
            // Hash password
            const pswHash = await bcrypt.hash(psw, 10);
            data.psw = pswHash;
        }

        // Controllo dati
        if (Object.keys(data).length <= 0)
            return resHandler(
                res,
                400,
                null,
                'Nessun campo valido da aggiornare!',
                false
            );

        // Aggiornamento utente
        const userRes = await UserModel.findByIdAndUpdate(user.id, data, {
            new: true,
        });

        // Controllo modifiche
        if (!userRes)
            return resHandler(
                res,
                500,
                null,
                'Modifiche non apportate correttamente!',
                false
            );

        // Risposta finale
        return resHandler(
            res,
            200,
            {
                id: userRes._id.toString(),
                role: userRes.role,
                email: userRes.email,
                createdAt: userRes.createdAt,
                updatedAt: userRes.updatedAt,
            },
            'Modifiche effettuate con successo!',
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

// Gestore delete user
async function deleteUser(req: Request, res: Response): Promise<Response> {
    // Gestione errori
    try {
        // Ricavo dati richiesta
        const user: UserType | undefined = req.body.user;

        // Controllo utente
        if (!user)
            return resHandler(
                res,
                401,
                null,
                'Autenticazione non eseguita correttamente!',
                false
            );

        // Eliminazione utente database
        const userDelete = await UserModel.findOneAndDelete({ _id: user.id });

        // Controllo eliminazione
        if (!userDelete)
            return resHandler(
                res,
                500,
                null,
                'Eliminazione utente non effettuata correttamente!',
                false
            );

        // Risposta finale
        return resHandler(
            res,
            200,
            {
                id: userDelete._id.toString(),
                role: userDelete.role,
                email: userDelete.email,
                createdAt: userDelete.createdAt,
                updatedAt: userDelete.updatedAt,
            },
            'Eliminazione utente effettuata con successo!',
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

// Esportazione gestori
export { getUser, patchUser, deleteUser };
