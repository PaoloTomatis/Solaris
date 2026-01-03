// Importazione moduli
import { Router } from 'express';
import usersRouter from './users.router.js';
import devicesRouter from './devices.router.js';
import irrigationsRouter from './irrigations.router.js';
import measurementsRouter from './measurements.router.js';

// Dichiarazione router
const apiRouter = Router();

// Definizione rotte
apiRouter
    .use('/me', usersRouter)
    .use('/devices', devicesRouter)
    .use('/irrigations', irrigationsRouter)
    .use('/measurements', measurementsRouter);

// Esportazione router
export default apiRouter;
