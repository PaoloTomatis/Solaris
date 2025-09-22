// Importazione moduli
import type { Request, Response } from 'express';
import resHandler from '../utils/responseHandler.js';
import UserSettingsModel from '../models/UserSettings.model.js';
import mongoose from 'mongoose';

// Gestore get user settings
async function getUserSettings(req: Request, res: Response): Promise<Response> {
    // Gestione errori
    try {
        // Ricavo dati richiesta
        const user:
            | {
                  id: mongoose.Types.ObjectId;
                  email: string;
                  role: string;
                  createdAt: Date;
              }
            | undefined = req.body.user;

        // Controllo utente
        if (!user)
            return resHandler(
                res,
                401,
                null,
                'Autenticazione non eseguita correttamente!',
                false
            );

        // Ricavo impostazioni utente database
        const userSettings = await UserSettingsModel.findOne({
            userId: user.id,
        });

        // Controllo impostazioni utente
        if (!userSettings)
            return resHandler(
                res,
                404,
                null,
                'Impostazioni utente non esistenti!',
                false
            );

        // Risposta finale
        return resHandler(
            res,
            200,
            {
                id: userSettings._id,
                styleMode: userSettings.styleMode,
                units: userSettings.units,
                userId: userSettings.userId,
                updatedAt: userSettings.updatedAt,
                createdAt: userSettings.createdAt,
            },
            'Impostazioni utente ricavate con successo!',
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

// Gestore patch user settings
async function patchUserSettings(
    req: Request,
    res: Response
): Promise<Response> {
    // Gestione errori
    try {
        // Ricavo dati richiesta
        const user:
            | {
                  id: mongoose.Types.ObjectId;
                  email: string;
                  role: string;
                  createdAt: Date;
              }
            | undefined = req.body.user;
        let {
            style_mode: styleMode,
            units,
        }: {
            style_mode: string | undefined;
            units: string | undefined;
        } = req.body;
        const errors: string[] = [];

        // Controllo utente
        if (!user)
            return resHandler(
                res,
                401,
                null,
                'Autenticazione non eseguita correttamente!',
                false
            );

        // Controllo stile
        if (
            typeof styleMode !== 'string' ||
            (styleMode !== 'dark' && styleMode !== 'light')
        ) {
            styleMode = 'light';
            errors.push('il tipo di stile è invalido o mancante');
        }

        // Controllo unità
        if (
            typeof units !== 'string' ||
            (units !== 'metric' && units !== 'imperial')
        ) {
            units = 'metric';
            errors.push('il tipo di unità è invalido o mancante');
        }

        // Aggiornamento o creazione impostazioni utente database
        const userSettings = await UserSettingsModel.findOneAndUpdate(
            { userId: user.id },
            { styleMode, units },
            { new: true, upsert: true }
        );

        // Controllo impostazioni utente
        if (!userSettings)
            return resHandler(
                res,
                404,
                null,
                'Impostazioni utente non trovate!',
                false
            );

        // Risposta finale
        return resHandler(
            res,
            200,
            {
                id: userSettings._id,
                styleMode: userSettings.styleMode,
                units: userSettings.units,
                userId: userSettings.userId,
                updatedAt: userSettings.updatedAt,
                createdAt: userSettings.createdAt,
            },
            'Impostazioni utente modificate con successo!' +
                (errors.length ? ` (${errors.join(', ')})` : ''),
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

// Gestore delete user settings
async function deleteUserSettings(
    req: Request,
    res: Response
): Promise<Response> {
    // Gestione errori
    try {
        // Ricavo dati richiesta
        const user:
            | {
                  id: mongoose.Types.ObjectId;
                  email: string;
                  role: string;
                  createdAt: Date;
              }
            | undefined = req.body.user;

        // Controllo utente
        if (!user)
            return resHandler(
                res,
                401,
                null,
                'Autenticazione non eseguita correttamente!',
                false
            );

        // Aggiornamento o creazione utente database
        const userSettings = await UserSettingsModel.findOneAndDelete({
            userId: user.id,
        });

        // Controllo impostazioni utente
        if (!userSettings)
            return resHandler(
                res,
                404,
                null,
                'Impostazioni utente non trovate!',
                false
            );

        // Risposta finale
        return resHandler(
            res,
            200,
            {
                id: userSettings._id,
                styleMode: userSettings.styleMode,
                units: userSettings.units,
                userId: userSettings.userId,
                updatedAt: userSettings.updatedAt,
                createdAt: userSettings.createdAt,
            },
            'Impostazioni utente eliminate con successo!',
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
export { getUserSettings, patchUserSettings, deleteUserSettings };
