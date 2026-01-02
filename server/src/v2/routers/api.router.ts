// Importazione moduli
import { Router } from 'express';
import userRouter from './user.router.js';

// Dichiarazione router
const apiRouter = Router();

// Definizione rotte
apiRouter.use('/me', userRouter);

// Esportazione router
export default apiRouter;
