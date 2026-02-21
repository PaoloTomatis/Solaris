// Importazione moduli
import type { NextFunction, Request, Response } from 'express';
import {
    DeleteNotificationsQuerySchema,
    GetNotificationsQuerySchema,
    PostNotificationsBodySchema,
} from '../schemas/Notifications.schema.js';
import {
    deleteNotificationsService,
    getNotificationsService,
    postNotificationsService,
} from '../services/notifications.service.js';
import resHandler from '../utils/responseHandler.js';
import { emitToRoom } from '../../global/utils/wsRoomHandlers.js';

// Controller get /notifications
async function getNotificationsController(
    req: Request,
    res: Response,
    next: NextFunction,
) {
    // Gestione errori
    try {
        // Validazione query
        const parsedQuery = GetNotificationsQuerySchema.parse(req.query);

        // Chiamata servizio
        const notifications = await getNotificationsService(
            parsedQuery,
            req.user,
        );

        // Risposta
        resHandler(res, true, 200, notifications);
    } catch (error) {
        next(error);
    }
}

// Controller post /notifications
async function postNotificationsController(
    req: Request,
    res: Response,
    next: NextFunction,
) {
    // Gestione errori
    try {
        // Validazione body
        const parsedBody = PostNotificationsBodySchema.parse(req.body);

        // Chiamata servizio
        const notification = await postNotificationsService(
            parsedBody,
            req.device,
        );

        // Invio notifiche ws
        emitToRoom(`USER-${req.device.userId}`, {
            event: 'v2/notifications',
            notification,
        });

        // Risposta
        resHandler(res, true, 200, notification);
    } catch (error) {
        next(error);
    }
}

// Controller delete /notifications
async function deleteNotificationsController(
    req: Request,
    res: Response,
    next: NextFunction,
) {
    // Gestione errori
    try {
        // Validazione body
        const parsedQuery = DeleteNotificationsQuerySchema.parse(req.query);

        // Chiamata servizio
        await deleteNotificationsService(parsedQuery, req.user);

        // Risposta
        resHandler(res, true, 200, null);
    } catch (error) {
        next(error);
    }
}
// Esportazione controller
export {
    getNotificationsController,
    postNotificationsController,
    deleteNotificationsController,
};
