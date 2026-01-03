// Importazione moduli
import { Router } from 'express';
import {
    deleteMeController,
    getMeController,
} from '../controllers/users.controller.js';
import {
    getMeSettingsController,
    patchMeSettingsController,
} from '../controllers/usersSettings.controller.js';

// Dichiarazione router
const usersRouter = Router();

// Definizione rotte
usersRouter
    .get('/user-settings', getMeSettingsController)
    .get('/', getMeController)
    .patch('/user-settings', patchMeSettingsController)
    .delete('/', deleteMeController);

// Esportazione router
export default usersRouter;
