// Importazione moduli
import type { NextFunction, Request, Response } from 'express';
import {
    devicesLoginService,
    logoutService,
    refreshService,
    usersLoginService,
    usersRegisterService,
} from '../services/authentication.service.js';
import {
    DevicesLoginBodySchema,
    InfoSchema,
    UsersLoginBodySchema,
    UsersRegisterBodySchema,
} from '../schemas/Authentication.schema.js';
import resHandler from '../utils/responseHandler.js';

// Controller post /user-login
async function usersLoginController(
    req: Request,
    res: Response,
    next: NextFunction,
) {
    // Gestione errori
    try {
        // Validazione body
        const parsedBody = UsersLoginBodySchema.parse(req.body);

        // Info
        const info = InfoSchema.parse({
            ipAddress: req.ip,
            userAgent: req.headers['user-agent'],
        });

        // Chiamata servizio
        const data = await usersLoginService(parsedBody, info);

        // Impostazione cookie
        res.cookie('refreshToken', data.refreshToken, {
            httpOnly: true,
            maxAge: 3 * 24 * 60 * 1000,
            secure: false,
            sameSite: 'lax',
        });

        // Risposta
        resHandler(res, true, 200, {
            accessToken: data.accessToken,
            user: data.user,
        });
    } catch (error) {
        next(error);
    }
}

// Controller post /device-login
async function devicesLoginController(
    req: Request,
    res: Response,
    next: NextFunction,
) {
    // Gestione errori
    try {
        // Validazione body
        const parsedBody = DevicesLoginBodySchema.parse(req.body);

        // Info
        const info = InfoSchema.parse({
            ipAddress: req.ip,
            userAgent: req.headers['user-agent'],
        });

        // Chiamata servizio
        const data = await devicesLoginService(parsedBody, info);

        // Impostazione cookie
        res.cookie('refreshToken', data.refreshToken, {
            httpOnly: true,
            maxAge: 3 * 24 * 60 * 1000,
            secure: false,
            sameSite: 'lax',
        });

        // Risposta
        resHandler(res, true, 200, {
            accessToken: data.accessToken,
            device: data.device,
        });
    } catch (error) {
        next(error);
    }
}

// Controller post /user-register
async function usersRegisterController(
    req: Request,
    res: Response,
    next: NextFunction,
) {
    // Gestione errori
    try {
        // Validazione body
        const parsedBody = UsersRegisterBodySchema.parse(req.body);

        // Chiamata servizio
        const data = await usersRegisterService(parsedBody);

        // Risposta
        resHandler(res, true, 200, data);
    } catch (error) {
        next(error);
    }
}

// Controller post /refresh
async function refreshController(
    req: Request,
    res: Response,
    next: NextFunction,
) {
    // Gestione errori
    try {
        // Validazione body
        const refreshToken: string | undefined = req.cookies.refreshToken;

        // Info
        const info = InfoSchema.parse({
            ipAddress: req.ip,
            userAgent: req.headers['user-agent'],
        });

        // Chiamata servizio
        const data = await refreshService(info, refreshToken);

        // Impostazione cookie
        res.cookie('refreshToken', data.refreshToken, {
            httpOnly: true,
            maxAge: 3 * 24 * 60 * 1000,
            secure: false,
            sameSite: 'lax',
        });

        // Risposta
        resHandler(res, true, 200, {
            accessToken: data.accessToken,
            user: data.user,
        });
    } catch (error) {
        next(error);
    }
}

// Controller post /logout
async function logoutController(
    req: Request,
    res: Response,
    next: NextFunction,
) {
    // Gestione errori
    try {
        // Validazione body
        const refreshToken: string | undefined = req.cookies.refreshToken;

        // Chiamata servizio
        const data = await logoutService(refreshToken, req.user, req.device);

        // Risposta
        resHandler(res, true, 200, data);
    } catch (error) {
        next(error);
    }
}

// Esportazione controller
export {
    usersLoginController,
    devicesLoginController,
    usersRegisterController,
    refreshController,
    logoutController,
};
