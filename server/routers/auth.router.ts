// Importazione moduli
import { Router } from 'express';
import login from '../controllers/login.controller.js';
import register from '../controllers/register.controller.js';
import refresh from '../controllers/refresh.controller.js';
import logout from '../controllers/logout.controller.js';

// Creazione router
const authRouter = Router();

// Rotte login, register, refresh, logout
authRouter
    .post('/login', login)
    .post('/register', register)
    .get('/refresh', refresh)
    .get('/logout', logout);

// Esportazione router
export default authRouter;
