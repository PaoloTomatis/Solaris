// Importazione moduli
import { Router } from 'express';
import userRouter from './users.router.js';
import userSettingsRouter from './user_settings.router.js';
import deviceRouter from './devices.router.js';
import deviceSettingsRouter from './device_settings.router.js';
import dataRouter from './data.router.js';

// Creazione router
const apiRouter = Router();

// Rotte users, users settings, devices, devices settings, data
apiRouter
    .use('/user', userRouter)
    .use('/user_settings', userSettingsRouter)
    .use('/', deviceRouter)
    .use('/device_settings', deviceSettingsRouter)
    .use('/data', dataRouter);

// Esportazione router
export default apiRouter;
