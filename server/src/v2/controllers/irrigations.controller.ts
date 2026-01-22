// Importazione moduli
import type { Request, Response, NextFunction } from 'express';
import {
    deleteIrrigationsService,
    getIrrigationsService,
    postIrrigationsService,
} from '../services/irrigations.service.js';
import resHandler from '../utils/responseHandler.js';
import {
    DeleteIrrigationsQuerySchema,
    GetIrrigationsQuerySchema,
    PostIrrigationsBodySchema,
} from '../schemas/Irrigations.schema.js';

// Controller get /irrigations
async function getIrrigationsController(
    req: Request,
    res: Response,
    next: NextFunction,
) {
    // Gestione errori
    try {
        // Validazione query
        const parsedQuery = GetIrrigationsQuerySchema.parse(req.query);

        // Chiamata servizio
        const irrigations = await getIrrigationsService(parsedQuery, req.user);

        // Risposta
        resHandler(res, true, 200, irrigations);
    } catch (error) {
        next(error);
    }
}

// Controller post /irrigations
async function postIrrigationsController(
    req: Request,
    res: Response,
    next: NextFunction,
) {
    // Gestione errori
    try {
        // Validazione body
        const parsedBody = PostIrrigationsBodySchema.parse(req.body);

        // Chiamata servizio
        const irrigation = await postIrrigationsService(parsedBody, req.device);

        // Risposta
        resHandler(res, true, 200, irrigation);
    } catch (error) {
        next(error);
    }
}

// Controller delete /irrigations
async function deleteIrrigationsController(
    req: Request,
    res: Response,
    next: NextFunction,
) {
    // Gestione errori
    try {
        // Validazione body
        const parsedQuery = DeleteIrrigationsQuerySchema.parse(req.query);

        // Chiamata servizio
        await deleteIrrigationsService(parsedQuery, req.user);

        // Risposta
        resHandler(res, true, 200, null);
    } catch (error) {
        next(error);
    }
}

// Esportazione controller
export {
    getIrrigationsController,
    postIrrigationsController,
    deleteIrrigationsController,
};
