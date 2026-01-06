// Importazione moduli
import type { NextFunction, Request, Response } from 'express';
import resHandler from '../utils/responseHandler.js';
import {
    getMeSettingsService,
    getDevicesSettingsService,
    patchDevicesSettingsService,
} from '../services/devicesSettings.service.js';
import {
    GetDevicesSettingsParamsSchema,
    PatchDevicesSettingsBodySchema,
} from '../schemas/DevicesSettings.schema.js';
import { PatchDevicesParamsSchema } from '../schemas/Devices.schema.js';

// Controller get /me/device-settings
async function getMeSettingsController(
    req: Request,
    res: Response,
    next: NextFunction
) {
    // Gestione errori
    try {
        // Chiamata servizio
        const deviceSettings = await getMeSettingsService(req.device);

        // Risposta
        resHandler(res, true, 200, deviceSettings);
    } catch (error) {
        next(error);
    }
}

// Controller get /devices-settings/:deviceId
async function getDevicesSettingsController(
    req: Request,
    res: Response,
    next: NextFunction
) {
    // Gestione errori
    try {
        // Validazione parametri
        const parsedParams = GetDevicesSettingsParamsSchema.parse(req.params);

        // Chiamata servizio
        const deviceSettings = await getDevicesSettingsService(parsedParams);

        // Risposta
        resHandler(res, true, 200, deviceSettings);
    } catch (error) {
        next(error);
    }
}

// Controller patch /device-settings/:deviceId
async function patchDevicesSettingsController(
    req: Request,
    res: Response,
    next: NextFunction
) {
    // Gestione errori
    try {
        // Validazione body
        const parsedBody = PatchDevicesSettingsBodySchema.parse(req.body);

        // Validazione parametri
        const parsedParams = PatchDevicesParamsSchema.parse(req.params);

        // Chiamata servizio
        const deviceSettings = await patchDevicesSettingsService(
            parsedBody,
            parsedParams,
            req.device
        );

        // Risposta
        resHandler(res, true, 200, deviceSettings);
    } catch (error) {
        next(error);
    }
}

// Esportazione controller
export {
    getMeSettingsController,
    getDevicesSettingsController,
    patchDevicesSettingsController,
};
