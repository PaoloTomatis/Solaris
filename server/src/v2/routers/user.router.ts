// Importazione moduli
import { Router } from 'express';
import {
    deleteMeController,
    getMeController,
} from '../controllers/users.controller.js';

// Dichiarazione router
const userRouter = Router();

// Definizione rotte
userRouter.get('/', getMeController).delete('/', deleteMeController);

// Esportazione router
export default userRouter;
