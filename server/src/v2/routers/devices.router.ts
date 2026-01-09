// Importazione moduli
import { Router } from 'express';
import {
    deleteDevicesController,
    getDeviceController,
    getDevicesController,
    patchDevicesController,
    postDevicesController,
} from '../controllers/devices.controller.js';

// Dichiarazione router
const devicesRouter = Router();

// Definizione rotte
devicesRouter
    .get('/:deviceId', getDeviceController)
    .get('/', getDevicesController)
    .post('/', postDevicesController)
    .patch('/:deviceId', patchDevicesController)
    .delete('/:deviceId', deleteDevicesController);

// Esportazione router
export default devicesRouter;
