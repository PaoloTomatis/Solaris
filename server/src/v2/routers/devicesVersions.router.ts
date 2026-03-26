// Importazione moduli
import { Router } from 'express';
import {
    getDevicesVersionsByIdController,
    getDevicesVersionsCheckController,
    getDevicesVersionsDeviceController,
    getDevicesVersionsUserController,
    postDevicesVersionsController,
    postDevicesVersionsInstallController,
} from '../controllers/devicesVersions.controller.js';

// Dichiarazione router
const devicesVersionsRouter = Router();

// Definizione rotte
devicesVersionsRouter
    .get('/user', getDevicesVersionsUserController)
    .get('/device', getDevicesVersionsDeviceController)
    .get('/:id', getDevicesVersionsByIdController)
    .get('/check', getDevicesVersionsCheckController)
    .post('/', postDevicesVersionsController)
    .post('/install', postDevicesVersionsInstallController);

// Esportazione router
export default devicesVersionsRouter;
