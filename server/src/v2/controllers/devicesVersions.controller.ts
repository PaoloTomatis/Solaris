// Importazione moduli
import type { NextFunction, Request, Response } from 'express';
import resHandler from '../utils/responseHandler.js';
import {
    getDevicesVersionsService,
    getDevicesVersionsByIdService,
    getDevicesVersionsCheckService,
    getDevicesVersionsLatestService,
    postDevicesVersionsInstallService,
    postDevicesVersionsService,
} from '../services/devicesVersions.service.js';
import {
    GetDevicesVersionsParamsSchema,
    GetDevicesVersionsQuerySchema,
    GetDevicesVersionsCheckQuerySchema,
    PostDevicesVersionsBodySchema,
    PostDevicesVersionsInstallBodySchema,
} from '../schemas/DevicesVersions.schema.js';
import { emitToRoom } from '../../global/utils/wsRoomHandlers.js';

// Controller get /devices-versions
async function getDevicesVersionsController(
    req: Request,
    res: Response,
    next: NextFunction,
) {
    // Gestione errori
    try {
        // Validazione query
        const parsedQuery = GetDevicesVersionsQuerySchema.parse(req.query);

        // Chiamata servizio
        const devicesVersions = await getDevicesVersionsService(
            parsedQuery,
            req.user,
        );

        // Risposta
        resHandler(res, true, 200, devicesVersions);
    } catch (error) {
        next(error);
    }
}

// Controller get /devices-versions/:id
async function getDevicesVersionsByIdController(
    req: Request,
    res: Response,
    next: NextFunction,
) {
    // Gestione errori
    try {
        // Validazione query
        const parsedParams = GetDevicesVersionsParamsSchema.parse(req.params);

        // Chiamata servizio
        const deviceVersion = await getDevicesVersionsByIdService(
            parsedParams,
            req.device,
        );

        console.log(deviceVersion);

        // Risposta
        resHandler(res, true, 200, deviceVersion);
    } catch (error) {
        next(error);
    }
}

// Controller get /devices-versions/check
async function getDevicesVersionsCheckController(
    req: Request,
    res: Response,
    next: NextFunction,
) {
    // Gestione errori
    try {
        // Validazione body
        const parsedBody = GetDevicesVersionsCheckQuerySchema.parse(req.query);

        // Chiamata servizio
        const deviceVersion = await getDevicesVersionsCheckService(
            parsedBody,
            req.device,
        );

        // Risposta
        resHandler(res, true, 200, deviceVersion);
    } catch (error) {
        next(error);
    }
}

// Controller get /devices-versions/latest
async function getDevicesVersionsLatestController(
    req: Request,
    res: Response,
    next: NextFunction,
) {
    // Gestione errori
    try {
        // Chiamata servizio
        const deviceVersion = await getDevicesVersionsLatestService(req.device);

        // Risposta
        resHandler(res, true, 200, deviceVersion);
    } catch (error) {
        next(error);
    }
}

// Controller post /devices-versions
async function postDevicesVersionsController(
    req: Request,
    res: Response,
    next: NextFunction,
) {
    // Gestione errori
    try {
        // Validazione body
        const parsedBody = PostDevicesVersionsBodySchema.parse(req.body);

        // Chiamata servizio
        const deviceVersion = await postDevicesVersionsService(
            parsedBody,
            req.user,
        );

        // Risposta
        resHandler(res, true, 200, deviceVersion);
    } catch (error) {
        next(error);
    }
}

// Controller post /devices-versions/install
async function postDevicesVersionsInstallController(
    req: Request,
    res: Response,
    next: NextFunction,
) {
    // Gestione errori
    try {
        // Validazione body
        const parsedBody = PostDevicesVersionsInstallBodySchema.parse(req.body);

        // Chiamata servizio
        const deviceSettings = await postDevicesVersionsInstallService(
            parsedBody,
            req.user,
        );

        // Invio impostazioni ws
        emitToRoom(`DEVICE-${parsedBody.deviceId}`, {
            event: 'v2/mode',
            mode: deviceSettings.mode,
            info: deviceSettings,
        });

        // Risposta
        resHandler(res, true, 200, null);
    } catch (error) {
        next(error);
    }
}

// Esportazione controller
export {
    getDevicesVersionsController,
    getDevicesVersionsByIdController,
    getDevicesVersionsCheckController,
    getDevicesVersionsLatestController,
    postDevicesVersionsController,
    postDevicesVersionsInstallController,
};
