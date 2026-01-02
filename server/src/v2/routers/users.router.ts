// Importazione moduli
import { Router } from 'express';
import {
    deleteMeController,
    getMeController,
} from '../controllers/users.controller.js';

// Dichiarazione router
const usersRouter = Router();

// Definizione rotte
usersRouter.get('/', getMeController).delete('/', deleteMeController);

// Esportazione router
export default usersRouter;
