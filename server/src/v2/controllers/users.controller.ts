// Importazione moduli
import type { NextFunction, Request, Response } from 'express';
import { deleteMeService, getMeService } from '../services/users.service.js';
import resHandler from '../utils/responseHandler.js';

// Controller get /me
async function getMeController(
    req: Request,
    res: Response,
    next: NextFunction
) {
    // Gestione errori
    try {
        // Chiamata servizio
        const user = await getMeService(req.user);

        // Risposta
        resHandler(res, true, 200, user);
    } catch (error) {
        next(error);
    }
}

// Controller delete /me
async function deleteMeController(
    req: Request,
    res: Response,
    next: NextFunction
) {
    // Gestione errori
    try {
        // Chiamata servizio
        await deleteMeService(req.user);

        // Risposta
        resHandler(res, true, 200, null);
    } catch (error) {
        next(error);
    }
}

// Esportazione controller
export { getMeController, deleteMeController };
