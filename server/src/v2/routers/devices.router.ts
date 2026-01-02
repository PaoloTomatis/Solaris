// Importazione moduli
import { Router } from 'express';
import {
    deleteDevicesController,
    getDeviceController,
    patchDevicesController,
    postDevicesController,
} from '../controllers/devices.controller.js';

// Dichiarazione router
const devicesRouter = Router();

// Definizione rotte
devicesRouter
    .get('/:deviceId', getDeviceController)
    .post('/', postDevicesController)
    .patch('/', patchDevicesController)
    .delete('/:deviceId', deleteDevicesController);

// Esportazione router
export default devicesRouter;
