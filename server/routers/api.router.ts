// Importazione moduli
import { Router } from 'express';
import userRouter from './users.router.js';

// Creazione router
const apiRouter = Router();

// Rotte users, users settings, devices, devices settings, data
apiRouter.use('/user', userRouter);

// Esportazione router
export default apiRouter;
