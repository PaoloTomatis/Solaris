// Importazione moduli
import { Router } from 'express';
import {
    getDevicesVersionsController,
    getDevicesVersionsByIdController,
    getDevicesVersionsCheckController,
    getDevicesVersionsLatestController,
    postDevicesVersionsController,
    postDevicesVersionsInstallController,
} from '../controllers/devicesVersions.controller.js';

// Dichiarazione router
const devicesVersionsRouter = Router();

// Definizione rotte
devicesVersionsRouter
    .get('/', getDevicesVersionsController)
    .get('/check', getDevicesVersionsCheckController)
    .get('/latest', getDevicesVersionsLatestController)
    .get('/:id', getDevicesVersionsByIdController)
    .post('/', postDevicesVersionsController)
    .post('/install', postDevicesVersionsInstallController);

// Esportazione router
export default devicesVersionsRouter;
