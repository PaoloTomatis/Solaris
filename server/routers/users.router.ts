// Importazione moduli
import { Router } from 'express';
import {
    getUser,
    patchUser,
    deleteUser,
} from '../controllers/users.controller.js';

// Creazione router
const userRouter = Router();

// Rotte get, patch, delete user
userRouter.get('/', getUser).patch('/', patchUser).delete('/', deleteUser);

// Esportazione router
export default userRouter;
