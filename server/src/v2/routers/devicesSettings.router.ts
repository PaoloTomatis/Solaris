// Importazione moduli
import { Router } from 'express';
import {
    getDevicesSettingsController,
    patchCalibrationController,
    patchDevicesSettingsController,
    postCalibrationController,
} from '../controllers/devicesSettings.controller.js';

// Dichiarazione router
const devicesSettingsRouter = Router();

// Definizione rotte
devicesSettingsRouter
    .get('/:deviceId', getDevicesSettingsController)
    .post('/:deviceId/calibration', postCalibrationController)
    .patch('/calibration', patchCalibrationController)
    .patch('/:deviceId', patchDevicesSettingsController);

// Esportazione router
export default devicesSettingsRouter;
