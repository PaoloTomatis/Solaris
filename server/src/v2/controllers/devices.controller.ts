// Importazione moduli
import type { Request, Response, NextFunction } from 'express';
import {
    GetDeviceParamsSchema,
    GetDevicesQuerySchema,
    PatchDeviceActivateParamsSchema,
    PatchDevicesBodySchema,
    PatchDevicesParamsSchema,
    PostDevicesBodySchema,
} from '../schemas/Devices.schema.js';
import resHandler from '../utils/responseHandler.js';
import {
    getDeviceService,
    getDevicesService,
    postDevicesService,
    patchDevicesService,
    deleteDevicesService,
    patchDevicesActivateService,
} from '../services/devices.service.js';

// Controller get /devices/:deviceId
async function getDeviceController(
    req: Request,
    res: Response,
    next: NextFunction,
) {
    // Gestione errori
    try {
        // Validazione parametri
        const { deviceId } = GetDeviceParamsSchema.parse(req.params);

        // Chiamata servizio
        const device = await getDeviceService(deviceId, req.user);

        // Risposta
        resHandler(res, true, 200, device);
    } catch (error) {
        next(error);
    }
}

// Controller get /devices
async function getDevicesController(
    req: Request,
    res: Response,
    next: NextFunction,
) {
    // Gestione errori
    try {
        // Validazione parametri
        const parsedQuery = GetDevicesQuerySchema.parse(req.query);

        // Chiamata servizio
        const devices = await getDevicesService(parsedQuery, req.user);

        // Risposta
        resHandler(res, true, 200, devices);
    } catch (error) {
        next(error);
    }
}

// Controller post /devices
async function postDevicesController(
    req: Request,
    res: Response,
    next: NextFunction,
) {
    // Gestione errori
    try {
        // Validazione body
        const parsedBody = PostDevicesBodySchema.parse(req.body);

        // Chiamata servizio
        const device = await postDevicesService(parsedBody, req.user);

        // Risposta
        resHandler(res, true, 200, device);
    } catch (error) {
        next(error);
    }
}

// Controller patch /devices/activate/:key
async function patchDevicesActivateController(
    req: Request,
    res: Response,
    next: NextFunction,
) {
    // Gestione errori
    try {
        // Validazione body
        const parsedParams = PatchDeviceActivateParamsSchema.parse(req.params);

        // Chiamata servizio
        const device = await patchDevicesActivateService(
            parsedParams,
            req.user,
        );

        // Risposta
        resHandler(res, true, 200, device);
    } catch (error) {
        next(error);
    }
}

// Controller patch /devices/:deviceId
async function patchDevicesController(
    req: Request,
    res: Response,
    next: NextFunction,
) {
    // Gestione errori
    try {
        // Validazione body
        const parsedBody = PatchDevicesBodySchema.parse(req.body);

        // Validazione parametri
        const parsedParams = PatchDevicesParamsSchema.parse(req.params);

        // Chiamata servizio
        const device = await patchDevicesService(
            parsedBody,
            parsedParams,
            req.user,
        );

        // Risposta
        resHandler(res, true, 200, device);
    } catch (error) {
        next(error);
    }
}

// Controller delete /devices/:deviceId
async function deleteDevicesController(
    req: Request,
    res: Response,
    next: NextFunction,
) {
    // Gestione errori
    try {
        // Validazione parametri
        const { deviceId } = PatchDevicesParamsSchema.parse(req.params);

        // Chiamata servizio
        await deleteDevicesService(deviceId, req.user);

        // Risposta
        resHandler(res, true, 200, null);
    } catch (error) {
        next(error);
    }
}

// Esportazione controller
export {
    getDeviceController,
    getDevicesController,
    postDevicesController,
    patchDevicesActivateController,
    patchDevicesController,
    deleteDevicesController,
};
