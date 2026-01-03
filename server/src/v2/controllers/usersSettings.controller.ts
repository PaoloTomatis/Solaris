// Importazione moduli
import type { NextFunction, Request, Response } from 'express';
import resHandler from '../utils/responseHandler.js';
import {
    getMeSettingsService,
    patchMeSettingsService,
} from '../services/usersSettings.service.js';
import { PatchUsersSettingsBodySchema } from '../schemas/UsersSettings.schema.js';

// Controller get /me/user-settings
async function getMeSettingsController(
    req: Request,
    res: Response,
    next: NextFunction
) {
    // Gestione errori
    try {
        // Chiamata servizio
        const userSettings = await getMeSettingsService(req.user);

        // Risposta
        resHandler(res, true, 200, userSettings);
    } catch (error) {
        next(error);
    }
}

// Controller patch /me/user-settings
async function patchMeSettingsController(
    req: Request,
    res: Response,
    next: NextFunction
) {
    // Gestione errori
    try {
        // Validazione body
        const parsedBody = PatchUsersSettingsBodySchema.parse(req.body);

        // Chiamata servizio
        const userSettings = await patchMeSettingsService(parsedBody, req.user);

        // Risposta
        resHandler(res, true, 200, userSettings);
    } catch (error) {
        next(error);
    }
}

// Esportazione controller
export { getMeSettingsController, patchMeSettingsController };
