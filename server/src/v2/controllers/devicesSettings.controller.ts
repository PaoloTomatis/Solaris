// Importazione moduli
import type { NextFunction, Request, Response } from 'express';
import resHandler from '../utils/responseHandler.js';
import {
    getMeSettingsService,
    getDevicesSettingsService,
    patchDevicesSettingsService,
    postCalibrationService,
    patchCalibrationService,
} from '../services/devicesSettings.service.js';
import {
    GetDevicesSettingsParamsSchema,
    PatchCalibrationBodySchema,
    PatchDevicesSettingsBodySchema,
    PostCalibrationBodySchema,
    PostCalibrationParamsSchema,
} from '../schemas/DevicesSettings.schema.js';
import { PatchDevicesParamsSchema } from '../schemas/Devices.schema.js';
import { emitToRoom } from '../../global/utils/wsRoomHandlers.js';

// Controller get /me/device-settings
async function getMeSettingsController(
    req: Request,
    res: Response,
    next: NextFunction,
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
    next: NextFunction,
) {
    // Gestione errori
    try {
        // Validazione parametri
        const parsedParams = GetDevicesSettingsParamsSchema.parse(req.params);

        // Chiamata servizio
        const deviceSettings = await getDevicesSettingsService(
            parsedParams,
            req.user,
        );

        // Risposta
        resHandler(res, true, 200, deviceSettings);
    } catch (error) {
        next(error);
    }
}

// Controller post /device-settings/:deviceId/calibration
async function postCalibrationController(
    req: Request,
    res: Response,
    next: NextFunction,
) {
    // Gestione errori
    try {
        // Validazione body
        const parsedBody = PostCalibrationBodySchema.parse(req.body);

        // Validazione parametri
        const parsedParams = PostCalibrationParamsSchema.parse(req.params);

        // Chiamata servizio
        const payload = await postCalibrationService(
            parsedBody,
            parsedParams,
            req.user,
        );

        // Invio impostazioni ws
        emitToRoom(`DEVICE-${parsedParams.deviceId}`, {
            event: 'v2/calibration',
            sensor: payload.sensor,
        });

        // Risposta
        resHandler(res, true, 200, payload);
    } catch (error) {
        next(error);
    }
}

// Controller patch /device-settings/:deviceId
async function patchDevicesSettingsController(
    req: Request,
    res: Response,
    next: NextFunction,
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
            req.user,
        );

        // Invio impostazioni ws
        emitToRoom(`DEVICE-${parsedParams.deviceId}`, {
            event: 'v2/mode',
            mode: deviceSettings.mode,
            info: deviceSettings,
        });

        // Risposta
        resHandler(res, true, 200, deviceSettings);
    } catch (error) {
        next(error);
    }
}

// Controller patch /device-settings/calibration
async function patchCalibrationController(
    req: Request,
    res: Response,
    next: NextFunction,
) {
    // Gestione errori
    try {
        // Validazione body
        const parsedBody = PatchCalibrationBodySchema.parse(req.body);

        // Chiamata servizio
        const deviceSettings = await patchCalibrationService(
            parsedBody,
            req.device,
        );

        // Invio impostazioni ws
        emitToRoom(`DEVICE-${req.device.id}`, {
            event: 'v2/mode',
            mode: deviceSettings.mode,
            info: deviceSettings,
        });

        // Invio calibrazione ws
        emitToRoom(`USER-${req.device.userId}`, {
            event: 'v2/calibration',
            sensor: parsedBody.sensor,
            measurement: parsedBody.measurement,
            deviceId: req.device.id,
        });

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
    postCalibrationController,
    patchDevicesSettingsController,
    patchCalibrationController,
};
