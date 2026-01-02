// Importazione moduli
import type { Request, Response, NextFunction } from 'express';
import {
    GetDevicesParamsSchema,
    PatchDevicesBodySchema,
    PatchDevicesParamsSchema,
    PostDevicesBodySchema,
} from '../schemas/Devices.schema.js';
import resHandler from '../utils/responseHandler.js';
import {
    getDevicesService,
    postDevicesService,
    patchDevicesService,
    deleteDevicesService,
} from '../services/devices.service.js';

// Controller get /devices/:deviceId
async function getDeviceController(
    req: Request,
    res: Response,
    next: NextFunction
) {
    // Gestione errori
    try {
        // Validazione parametri
        const { deviceId } = GetDevicesParamsSchema.parse(req.params);

        // Chiamata servizio
        const device = await getDevicesService(deviceId, req.user);

        // Risposta
        resHandler(res, true, 200, device);
    } catch (error) {
        next(error);
    }
}

// Controller post /devices
async function postDevicesController(
    req: Request,
    res: Response,
    next: NextFunction
) {
    // Gestione errori
    try {
        // Validazione parametri
        const body = PostDevicesBodySchema.parse(req.body);

        // Chiamata servizio
        const device = await postDevicesService(body, req.user);

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
    next: NextFunction
) {
    // Gestione errori
    try {
        // Validazione parametri
        const body = PatchDevicesBodySchema.parse(req.body);
        const params = PatchDevicesParamsSchema.parse(req.params);

        // Chiamata servizio
        const device = await patchDevicesService(body, params, req.user);

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
    next: NextFunction
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
    postDevicesController,
    patchDevicesController,
    deleteDevicesController,
};
