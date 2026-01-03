// Importazione moduli
import { Router } from 'express';
import {
    deleteMeController,
    getMeController,
} from '../controllers/users.controller.js';
import {
    getMeSettingsController as getMeUsersSettingsController,
    patchMeSettingsController,
} from '../controllers/usersSettings.controller.js';
import { getMeSettingsController as getMeDevicesSettingsController } from '../controllers/devicesSettings.controller.js';

// Dichiarazione router
const usersRouter = Router();

// Definizione rotte
usersRouter
    .get('/user-settings', getMeUsersSettingsController)
    .get('/device-settings', getMeDevicesSettingsController)
    .get('/', getMeController)
    .patch('/user-settings', patchMeSettingsController)
    .delete('/', deleteMeController);

// Esportazione router
export default usersRouter;
