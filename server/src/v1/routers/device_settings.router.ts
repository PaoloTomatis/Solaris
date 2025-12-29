// Importazione moduli
import { Router } from 'express';
import {
    getDeviceSettings,
    patchDeviceSettings,
    deleteDeviceSettings,
} from '../controllers/device_settings.controller.js';
import rateLimit from 'express-rate-limit';
import {
    getRequestsLimiter,
    patchRequestsLimiter,
    deleteRequestsLimiter,
} from '../../global/utils/rateLimit.js';

// Creazione router
const deviceSettingsRouter = Router();

// Rotte get, patch, delete device settings
deviceSettingsRouter
    .get('/', rateLimit(getRequestsLimiter), getDeviceSettings)
    .patch('/:id', rateLimit(patchRequestsLimiter), patchDeviceSettings)
    .delete('/:id', rateLimit(deleteRequestsLimiter), deleteDeviceSettings);

// Esportazione router
export default deviceSettingsRouter;
