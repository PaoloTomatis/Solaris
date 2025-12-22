// Importazione moduli
import { Router } from 'express';
import {
    getDevices,
    postDevice,
    patchDevice,
    deleteDevice,
    activateDevice,
    updateModeDevice,
} from '../controllers/devices.controller.js';
import rateLimit from 'express-rate-limit';
import {
    getRequestsLimiter,
    postRequestsLimiter,
    patchRequestsLimiter,
    deleteRequestsLimiter,
} from '../utils/rateLimit.js';

// Creazione router
const deviceRouter = Router();

// Rotte get, post, patch, delete device
deviceRouter
    .get('/devices', rateLimit(getRequestsLimiter), getDevices)
    .post('/device', rateLimit(postRequestsLimiter), postDevice)
    .patch('/device/:id', rateLimit(patchRequestsLimiter), patchDevice)
    .delete('/device/:id', rateLimit(deleteRequestsLimiter), deleteDevice)
    .patch(
        '/activate_device/:key',
        rateLimit(patchRequestsLimiter),
        activateDevice
    )
    .patch(
        '/update_mode/:id',
        rateLimit(patchRequestsLimiter),
        updateModeDevice
    );

// Esportazione router
export default deviceRouter;
