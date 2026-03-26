// Importazione moduli
import type { NextFunction, Request, Response } from 'express';
import resHandler from '../utils/responseHandler.js';
import {
    getDevicesVersionsByIdService,
    getDevicesVersionsCheckService,
    getDevicesVersionsDeviceService,
    getDevicesVersionsUserService,
    postDevicesVersionsInstallService,
    postDevicesVersionsService,
} from '../services/devicesVersions.service.js';
import {
    GetDevicesVersionsDeviceQuerySchema,
    GetDevicesVersionsParamsSchema,
    GetDevicesVersionsUserQuerySchema,
    PostDevicesVersionsBodySchema,
    PostDevicesVersionsInstallBodySchema,
} from '../schemas/DevicesVersions.schema.js';
import { emitToRoom } from '../../global/utils/wsRoomHandlers.js';

// Controller get /devices-versions/user
async function getDevicesVersionsUserController(
    req: Request,
    res: Response,
    next: NextFunction,
) {
    // Gestione errori
    try {
        // Validazione query
        const parsedQuery = GetDevicesVersionsUserQuerySchema.parse(req.query);

        // Chiamata servizio
        const devicesVersions = await getDevicesVersionsUserService(
            parsedQuery,
            req.user,
        );

        // Risposta
        resHandler(res, true, 200, devicesVersions);
    } catch (error) {
        next(error);
    }
}

// Controller get /devices-versions/device
async function getDevicesVersionsDeviceController(
    req: Request,
    res: Response,
    next: NextFunction,
) {
    // Gestione errori
    try {
        // Validazione query
        const parsedQuery = GetDevicesVersionsDeviceQuerySchema.parse(
            req.query,
        );

        // Chiamata servizio
        const devicesVersions = await getDevicesVersionsDeviceService(
            parsedQuery,
            req.device,
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
            req.user,
        );

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
        // Chiamata servizio
        const deviceVersion = await getDevicesVersionsCheckService(req.device);

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
        const deviceVersion = await postDevicesVersionsInstallService(
            parsedBody,
            req.user,
        );

        // Invio aggiornamento ws
        emitToRoom(`DEVICE-${parsedBody.deviceId}`, {
            event: 'v2/update',
            firmwareVersion: deviceVersion.firmwareVersion,
            channel: deviceVersion.channel,
        });

        // Risposta
        resHandler(res, true, 200, null);
    } catch (error) {
        next(error);
    }
}

// Esportazione controller
export {
    getDevicesVersionsByIdController,
    getDevicesVersionsCheckController,
    getDevicesVersionsDeviceController,
    getDevicesVersionsUserController,
    postDevicesVersionsController,
    postDevicesVersionsInstallController,
};
