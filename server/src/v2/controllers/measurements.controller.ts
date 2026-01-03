// Importazione moduli
import type { NextFunction, Request, Response } from 'express';
import {
    GetMeasurementsQuerySchema,
    PostMeasurementsBodySchema,
} from '../schemas/Measurements.schema.js';
import {
    getMeasurementsService,
    postMeasurementsService,
} from '../services/measurements.service.js';
import resHandler from '../utils/responseHandler.js';

// Controller get /measurements
async function getMeasurementsController(
    req: Request,
    res: Response,
    next: NextFunction
) {
    // Gestione errori
    try {
        // Validazione query
        const parsedQuery = GetMeasurementsQuerySchema.parse(req.query);

        // Chiamata servizio
        const measurements = getMeasurementsService(parsedQuery, req.user);

        // Risposta
        resHandler(res, true, 200, measurements);
    } catch (error) {
        next(error);
    }
}

// Controller post /measurements
async function postMeasurementsController(
    req: Request,
    res: Response,
    next: NextFunction
) {
    // Gestione errori
    try {
        // Validazione body
        const parsedBody = PostMeasurementsBodySchema.parse(req.body);

        // Chiamata servizio
        const measurement = postMeasurementsService(parsedBody, req.device);

        // Risposta
        resHandler(res, true, 200, measurement);
    } catch (error) {
        next(error);
    }
}

// Esportazione controller
export { getMeasurementsController, postMeasurementsController };
