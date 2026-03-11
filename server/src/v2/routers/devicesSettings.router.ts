// Importazione moduli
import { Router } from 'express';
import {
    getDevicesSettingsController,
    postCalibrationDataController,
    patchDevicesSettingsController,
    postCalibrationExecuteController,
} from '../controllers/devicesSettings.controller.js';

// Dichiarazione router
const devicesSettingsRouter = Router();

// Definizione rotte
devicesSettingsRouter
    .get('/:deviceId', getDevicesSettingsController)
    .post('/:deviceId/calibration/execute', postCalibrationExecuteController)
    .post('/calibration/data', postCalibrationDataController)
    .patch('/:deviceId', patchDevicesSettingsController);

// Esportazione router
export default devicesSettingsRouter;
