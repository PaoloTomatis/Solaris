// Importazione moduli
import type { Request, Response } from 'express';
import resHandler from '../utils/responseHandler.js';
import UserModel from '../models/User.model.js';
import bcrypt from 'bcrypt';
import type { ObjectId } from 'mongoose';

// Gestore get user
async function getUser(req: Request, res: Response): Promise<Response> {
    // Gestione errori
    try {
        // Ricavo dati richiesta
        const user: { id: ObjectId; email: string } | undefined = req.body.user;

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
                user: {
                    id: userRes._id,
                    email: userRes.email,
                    createdAt: userRes.createdAt,
                },
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
        const user: { id: ObjectId; email: string } | undefined = req.body.user;
        const {
            email,
            psw,
        }: { email: string | undefined; psw: string | undefined } = req.body;

        // Liste modifiche
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
                user: {
                    id: userRes._id,
                    email: userRes.email,
                    createdAt: userRes.createdAt,
                },
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
        const user: { id: ObjectId; email: string } | undefined = req.body.user;

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
        const userDelete = await UserModel.deleteOne({ _id: user.id });

        // Controllo eliminazione
        if (userDelete.deletedCount <= 0)
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
            null,
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

// Esportazione gestore
export { getUser, patchUser, deleteUser };
