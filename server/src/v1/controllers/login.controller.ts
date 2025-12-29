// Importazione moduli
import bcrypt from 'bcrypt';
import type { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import resHandler from '../../global/utils/responseHandler.js';
import UserModel from '../models/User.model.js';
import type { UserType } from '../models/User.model.js';
import type { DeviceType } from '../models/Device.model.js';
import DeviceModel from '../models/Device.model.js';

// Gestore login
async function login(req: Request, res: Response): Promise<Response> {
    // Gestione errori
    try {
        // Ricavo dati richiesta
        const {
            email,
            key,
            psw,
            type,
        }: { email?: string; key?: string; psw?: string; type?: string } =
            req.body;

        // Dichiarazione soggetto
        let subject: UserType | DeviceType | undefined | null;

        // Controllo email/key
        if (
            type === 'user'
                ? !email || typeof email !== 'string'
                : !key || typeof key !== 'string'
        )
            return resHandler(
                res,
                400,
                null,
                'Email/Chiave invalida o mancante!',
                false
            );

        // Controllo password
        if (!psw || typeof psw !== 'string')
            return resHandler(
                res,
                400,
                null,
                'Password invalida o mancante!',
                false
            );

        // Ricavo soggetto database
        subject =
            type === 'user'
                ? await UserModel.findOne({ email })
                : await DeviceModel.findOne({ key });

        // Controllo soggetto
        if (!subject)
            return resHandler(
                res,
                401,
                null,
                'Email/Chiave o Password errati!',
                false
            );

        // Controllo psw
        let pswCheck: boolean = false;
        if (subject.psw) {
            pswCheck = await bcrypt.compare(psw, subject.psw);
        }
        if (!pswCheck)
            return resHandler(
                res,
                401,
                null,
                'Email/Chiave o Password errati!'
            );

        // Controllo chiavi
        if (!process.env.JWT_ACCESS || !process.env.JWT_REFRESH)
            return resHandler(
                res,
                500,
                null,
                "Variabili d'ambiente mancanti!",
                false
            );

        // Firma access token
        const accessToken = jwt.sign(
            type === 'user'
                ? {
                      id: subject._id,
                      email: (subject as UserType).email,
                      role: (subject as UserType).role,
                      updatedAt: subject.updatedAt,
                      createdAt: subject.createdAt,
                  }
                : {
                      id: subject._id,
                      key: (subject as DeviceType).key,
                      updatedAt: subject.updatedAt,
                      createdAt: subject.createdAt,
                  },
            process.env.JWT_ACCESS,
            { expiresIn: '1h' }
        );

        // Firma refresh token
        const refreshToken = jwt.sign(
            type === 'user'
                ? {
                      id: subject._id,
                      email: (subject as UserType).email,
                      role: (subject as UserType).role,
                      updatedAt: subject.updatedAt,
                      createdAt: subject.createdAt,
                  }
                : {
                      id: subject._id,
                      key: (subject as DeviceType).key,
                      updatedAt: subject.updatedAt,
                      createdAt: subject.createdAt,
                  },
            process.env.JWT_REFRESH,
            { expiresIn: '3d' }
        );

        // Salvataggio refresh token
        res.cookie('refreshToken', refreshToken, {
            httpOnly: true,
            maxAge: 7 * 24 * 60 * 1000,
            secure: true,
            sameSite: 'lax',
        });

        // Risposta finale
        return resHandler(
            res,
            200,
            {
                accessToken,
                subject:
                    type === 'user'
                        ? {
                              id: subject._id,
                              email: (subject as UserType).email,
                              role: (subject as UserType).role,
                              updatedAt: subject.updatedAt,
                              createdAt: subject.createdAt,
                          }
                        : {
                              id: subject._id,
                              prototypeModel: (subject as DeviceType)
                                  .prototypeModel,
                              name: (subject as DeviceType).name,
                              key: (subject as DeviceType).key,
                              mode: (subject as DeviceType).mode,
                              activatedAt: (subject as DeviceType).activatedAt,
                              updatedAt: subject.updatedAt,
                              createdAt: subject.createdAt,
                          },
            },
            'Login effettuato con successo!',
            true
        );
    } catch (error: unknown) {
        // Errore in console
        console.error(error);
        const errorMsg =
            error instanceof Error
                ? error?.message || 'Errore interno del server!'
                : 'Errore sconosciuto!';
        // Risposta finale
        return resHandler(res, 500, null, errorMsg, false);
    }
}

// Esportazione gestore
export default login;
