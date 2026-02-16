// Importazione moduli
import { Router } from 'express';
import {
    getDevicesSettingsController,
    patchDevicesSettingsController,
} from '../controllers/devicesSettings.controller.js';

// Dichiarazione router
const devicesSettingsRouter = Router();

// Definizione rotte
devicesSettingsRouter
    .get('/:deviceId', getDevicesSettingsController)
    .patch('/:deviceId', patchDevicesSettingsController);

// Esportazione router
export default devicesSettingsRouter;
