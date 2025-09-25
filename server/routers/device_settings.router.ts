// Importazione moduli
import { Router } from 'express';
import {
    getDeviceSettings,
    patchDeviceSettings,
    deleteDeviceSettings,
} from '../controllers/device_settings.controller.js';

// Creazione router
const deviceSettingsRouter = Router();

// Rotte get, patch, delete device settings
deviceSettingsRouter
    .get('/', getDeviceSettings)
    .patch('/:id', patchDeviceSettings)
    .delete('/:id', deleteDeviceSettings);

// Esportazione router
export default deviceSettingsRouter;
