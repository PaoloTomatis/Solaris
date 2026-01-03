// Importazione moduli
import { Router } from 'express';
import usersRouter from './users.router.js';
import devicesRouter from './devices.router.js';
import irrigationsRouter from './irrigations.router.js';
import measurementsRouter from './measurements.router.js';
import notificationsRouter from './notifications.router.js';

// Dichiarazione router
const apiRouter = Router();

// Definizione rotte
apiRouter
    .use('/me', usersRouter)
    .use('/devices', devicesRouter)
    .use('/irrigations', irrigationsRouter)
    .use('/measurements', measurementsRouter)
    .use('/notifications', notificationsRouter);

// Esportazione router
export default apiRouter;
