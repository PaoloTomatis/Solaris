// Importazione moduli
import { Router } from 'express';
import {
    deleteDevice,
    getDevices,
    patchDevice,
    postDevice,
} from '../controllers/devices.controller.js';

// Creazione router
const deviceRouter = Router();

// Rotte get, post, patch, delete device
deviceRouter
    .get('/devices', getDevices)
    .post('/device', postDevice)
    .patch('/device/:id', patchDevice)
    .delete('/device/:id', deleteDevice);

// Esportazione router
export default deviceRouter;
