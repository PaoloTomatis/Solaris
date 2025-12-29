// Importazione moduli
import { Router } from 'express';
import {
    getUser,
    patchUser,
    deleteUser,
} from '../controllers/users.controller.js';
import rateLimit from 'express-rate-limit';
import {
    getRequestsLimiter,
    patchRequestsLimiter,
    deleteRequestsLimiter,
} from '../../global/utils/rateLimit.js';

// Creazione router
const userRouter = Router();

// Rotte get, patch, delete user
userRouter
    .get('/', rateLimit(getRequestsLimiter), getUser)
    .patch('/', rateLimit(patchRequestsLimiter), patchUser)
    .delete('/', rateLimit(deleteRequestsLimiter), deleteUser);

// Esportazione router
export default userRouter;
