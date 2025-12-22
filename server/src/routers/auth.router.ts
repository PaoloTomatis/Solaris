// Importazione moduli
import { Router } from 'express';
import login from '../controllers/login.controller.js';
import register from '../controllers/register.controller.js';
import refresh from '../controllers/refresh.controller.js';
import logout from '../controllers/logout.controller.js';
import rateLimit from 'express-rate-limit';
import {
    loginLimiter,
    registerLimiter,
    refreshLimiter,
} from '../utils/rateLimit.js';

// Creazione router
const authRouter = Router();

// Rotte login, register, refresh, logout
authRouter
    .post('/login', rateLimit(loginLimiter), login)
    .post('/register', rateLimit(registerLimiter), register)
    .get('/refresh', rateLimit(refreshLimiter), refresh)
    .get('/logout', logout);

// Esportazione router
export default authRouter;
