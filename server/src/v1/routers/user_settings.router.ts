// Importazione moduli
import { Router } from 'express';
import {
    getUserSettings,
    patchUserSettings,
    deleteUserSettings,
} from '../controllers/user_settings.controller.js';
import rateLimit from 'express-rate-limit';
import {
    getRequestsLimiter,
    patchRequestsLimiter,
    deleteRequestsLimiter,
} from '../../global/utils/rateLimit.js';

// Creazione router
const userSettingsRouter = Router();

// Rotte get, patch, delete user settings
userSettingsRouter
    .get('/', rateLimit(getRequestsLimiter), getUserSettings)
    .patch('/', rateLimit(patchRequestsLimiter), patchUserSettings)
    .delete('/', rateLimit(deleteRequestsLimiter), deleteUserSettings);

// Esportazione router
export default userSettingsRouter;
