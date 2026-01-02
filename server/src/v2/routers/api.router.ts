// Importazione moduli
import { Router } from 'express';
import usersRouter from './users.router.js';
import devicesRouter from './devices.router.js';

// Dichiarazione router
const apiRouter = Router();

// Definizione rotte
apiRouter.use('/me', usersRouter).use('/devices', devicesRouter);

// Esportazione router
export default apiRouter;
