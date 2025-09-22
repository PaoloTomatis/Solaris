// Importazione moduli
import { Router } from 'express';
import userRouter from './users.router.js';
import userSettingsRouter from './user_settings.router.js';
import deviceRouter from './devices.router.js';

// Creazione router
const apiRouter = Router();

// Rotte users, users settings, devices, devices settings, data
apiRouter
    .use('/user', userRouter)
    .use('/user_settings', userSettingsRouter)
    .use('/', deviceRouter);

// Esportazione router
export default apiRouter;
