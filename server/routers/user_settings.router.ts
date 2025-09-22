// Importazione moduli
import { Router } from 'express';
import {
    getUserSettings,
    patchUserSettings,
    deleteUserSettings,
} from '../controllers/user_settings.controller.js';

// Creazione router
const userSettingsRouter = Router();

// Rotte get, patch, delete user
userSettingsRouter
    .get('/', getUserSettings)
    .patch('/', patchUserSettings)
    .delete('/', deleteUserSettings);

// Esportazione router
export default userSettingsRouter;
