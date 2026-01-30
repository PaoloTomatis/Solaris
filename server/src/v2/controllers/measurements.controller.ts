// Importazione moduli
import type { NextFunction, Request, Response } from 'express';
import {
    DeleteMeasurementsQuerySchema,
    GetMeasurementsQuerySchema,
    PostMeasurementsBodySchema,
} from '../schemas/Measurements.schema.js';
import {
    deleteMeasurementsService,
    getMeasurementsService,
    postMeasurementsService,
} from '../services/measurements.service.js';
import resHandler from '../utils/responseHandler.js';
import { emitToRoom } from '../../global/utils/wsRoomHandlers.js';

// Controller get /measurements
async function getMeasurementsController(
    req: Request,
    res: Response,
    next: NextFunction,
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
    next: NextFunction,
) {
    // Gestione errori
    try {
        // Validazione body
        const parsedBody = PostMeasurementsBodySchema.parse(req.body);

        // Chiamata servizio
        const measurement = await postMeasurementsService(
            parsedBody,
            req.device,
        );

        // Invio misurazioni ws
        emitToRoom(`USER-${req.device.userId}`, {
            event: 'v2/measurements',
            data: measurement,
        });

        // Risposta
        resHandler(res, true, 200, measurement);
    } catch (error) {
        next(error);
    }
}

// Controller delete /measurements
async function deleteMeasurementsController(
    req: Request,
    res: Response,
    next: NextFunction,
) {
    // Gestione errori
    try {
        // Validazione body
        const parsedQuery = DeleteMeasurementsQuerySchema.parse(req.query);

        // Chiamata servizio
        await deleteMeasurementsService(parsedQuery, req.user);

        // Risposta
        resHandler(res, true, 200, null);
    } catch (error) {
        next(error);
    }
}

// Esportazione controller
export {
    getMeasurementsController,
    postMeasurementsController,
    deleteMeasurementsController,
};
