// Importazione moduli
import type { Request, Response } from 'express';
import resHandler from '../../global/utils/responseHandler.js';
import UserSettingsModel from '../models/UserSettings.model.js';
import type { UserType } from '../../global/types/types.js';

// Gestore get user settings
async function getUserSettings(req: Request, res: Response): Promise<Response> {
    // Gestione errori
    try {
        // Ricavo dati richiesta
        const user: UserType | undefined = req.user;

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
                id: userSettings._id.toString(),
                styleMode: userSettings.styleMode,
                units: userSettings.units,
                userId: userSettings.userId.toString(),
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
        const user: UserType | undefined = req.user;
        let {
            styleMode,
            units,
        }: {
            styleMode?: string;
            units?: string;
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
                id: userSettings._id.toString(),
                styleMode: userSettings.styleMode,
                units: userSettings.units,
                userId: userSettings.userId.toString(),
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
        const user: UserType | undefined = req.user;

        // Controllo utente
        if (!user)
            return resHandler(
                res,
                401,
                null,
                'Autenticazione non eseguita correttamente!',
                false
            );

        // Eliminazione impostazioni utente database
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
                id: userSettings._id.toString(),
                styleMode: userSettings.styleMode,
                units: userSettings.units,
                userId: userSettings.userId.toString(),
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

// Esportazione gestori
export { getUserSettings, patchUserSettings, deleteUserSettings };
