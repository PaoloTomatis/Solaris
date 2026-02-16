// Importazione moduli
import { Router } from 'express';
import {
    devicesLoginController,
    logoutController,
    refreshController,
    usersLoginController,
    usersRegisterController,
} from '../controllers/authentication.controller.js';

// Dichiarazione router
const authRouter = Router();

// Definizione rotte
authRouter
    .post('/user-login', usersLoginController)
    .post('/device-login', devicesLoginController)
    .post('/user-register', usersRegisterController)
    .post('/refresh', refreshController)
    .post('/logout', logoutController);

// Esportazione router
export default authRouter;
