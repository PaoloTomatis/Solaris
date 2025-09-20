// Importazione moduli
import type { Request, Response } from 'express';
import resHandler from '../utils/responseHandler.js';
import UserSettingsModel from '../models/UserSettings.model.js';
import type { ObjectId } from 'mongoose';

// Gestore get user settings
async function getUserSettings(req: Request, res: Response): Promise<Response> {
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
        const user: { id: ObjectId; email: string } | undefined = req.body.user;
        let {
            style_mode: styleMode,
            units,
        }: {
            style_mode: string | undefined;
            units: string | undefined;
        } = req.body;
        const errors: string[] = [];
        let status: 200 | 201;

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

        // Ricavo impostazioni utente database
        const dupUserSettings = await UserSettingsModel.findOne({
            userId: user.id,
        });

        // Definizione impostazioni utente
        let userSettings: {
            _id?: ObjectId | string | number;
            userId: ObjectId | string | number;
            styleMode?: string;
            units?: string;
            updatedAt?: string;
        } | null;

        // Controllo impostazioni utente
        if (dupUserSettings) {
            userSettings = await UserSettingsModel.findOneAndUpdate(
                { userId: user.id },
                { styleMode, units, updatedAt: new Date().toISOString() },
                { new: true }
            );

            // Impostazione stato
            status = 200;
        } else {
            // Creazione impostazioni utente database
            const newUserSettings = new UserSettingsModel({
                styleMode,
                units,
                userId: user.id,
                updatedAt: new Date().toISOString(),
            });

            // Salvataggio utente
            userSettings = await newUserSettings.save();

            // Impostazione stato
            status = 201;
        }

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
            status,
            {
                id: userSettings._id,
                styleMode: userSettings.styleMode,
                units: userSettings.units,
                userId: userSettings.userId,
                updatedAt: userSettings.updatedAt,
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

// Esportazione gestore
export { getUserSettings, patchUserSettings };
