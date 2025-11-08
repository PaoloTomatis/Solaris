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

// Creazione router
const deviceRouter = Router();

// Rotte get, post, patch, delete device
deviceRouter
    .get('/devices', getDevices)
    .post('/device', postDevice)
    .patch('/device/:id', patchDevice)
    .delete('/device/:id', deleteDevice)
    .patch('/activate_device/:key', activateDevice)
    .patch('/update_mode/:id', updateModeDevice);

// Esportazione router
export default deviceRouter;
