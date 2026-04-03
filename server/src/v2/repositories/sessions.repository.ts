// Importazione moduli
import { type FilterQuery } from 'mongoose';
import SessionsModel, { type SessionsType } from '../models/Sessions.model.js';
import type { IdType } from '../types/types.js';

// Respository sessioni
class SessionsRepository {
    // Funzione richiesta sessioni da id utente
    async findMany(payload: {
        status?: 'active' | 'revoked' | 'expired';
        refreshToken?: string;
        userId?: IdType;
        deviceId?: IdType;
        subject?: 'user' | 'device';
    }) {
        // Richiesta sessione database
        const sessions = await SessionsModel.find(payload).lean();

        // Ritorno sessione
        return sessions;
    }

    // Funzione richiesta sessioni da id utente
    async findManyByUserId(
        userId: IdType,
        type?: 'active' | 'revoked' | 'expired',
    ) {
        // Dichiarazione filtri
        const filter: FilterQuery<SessionsType> = {
            userId: userId,
            subject: 'user',
        };

        // Controllo type
        if (type) filter.status = type;

        // Richiesta sessione database
        const sessions = await SessionsModel.find(filter).lean();

        // Ritorno sessione
        return sessions;
    }

    // Funzione richiesta sessioni da id utente
    async findManyByDeviceId(
        deviceId: IdType,
        type?: 'active' | 'revoked' | 'expired',
    ) {
        // Dichiarazione filtri
        const filter: FilterQuery<SessionsType> = {
            deviceId: deviceId,
            subject: 'device',
        };

        // Controllo type
        if (type) filter.status = type;

        // Richiesta sessione database
        const sessions = await SessionsModel.find(filter).lean();

        // Ritorno sessione
        return sessions;
    }

    // Funzione richiesta sessioni da id utente
    async findManyByIp(ip: string, type?: 'active' | 'revoked' | 'expired') {
        // Dichiarazione filtri
        const filter: FilterQuery<SessionsType> = {
            ipAddress: ip,
        };

        // Controllo type
        if (type) filter.status = type;

        // Richiesta sessione database
        const sessions = await SessionsModel.find(filter).lean();

        // Ritorno sessione
        return sessions;
    }

    // Funzione creazione sessioni
    async createOne(payload: {
        userId?: IdType;
        deviceId?: IdType;
        refreshToken: string;
        ipAddress: string;
        userAgent: string;
        status: 'active' | 'expired' | 'revoked';
    }) {
        // Creazione sessione database
        const session = new SessionsModel({
            ...payload,
            subject: payload.userId
                ? 'user'
                : payload.deviceId
                  ? 'device'
                  : 'user',
        });

        // Salvataggio sessione
        await session.save();

        // Ritorno sessione
        return session.toObject();
    }

    // Funzione creazione sessioni
    async updateOneById(
        id: IdType,
        payload: {
            type?: 'active' | 'revoked' | 'expired';
        },
    ) {
        // Aggiornamento sessione database
        const session = await SessionsModel.findByIdAndUpdate(id, {
            status: payload.type,
        }).lean();

        // Ritorno sessione
        return session;
    }

    // Funzione aggiornamento sessioni
    async updateManyByUserId(
        userId: IdType,
        payload: { type?: 'active' | 'revoked' | 'expired' },
    ) {
        // Aggiornamento sessione database
        const sessions = await SessionsModel.updateMany(
            { userId },
            {
                status: payload.type,
            },
        ).lean();

        // Ritorno sessione
        return sessions;
    }

    // Funzione aggiornamento sessioni
    async updateManyByDeviceId(
        deviceId: IdType,
        payload: { type?: 'active' | 'revoked' | 'expired' },
    ) {
        // Aggiornamento sessione database
        const sessions = await SessionsModel.updateMany(
            { deviceId },
            {
                status: payload.type,
            },
        ).lean();

        // Ritorno sessione
        return sessions;
    }
}

// Esportazione repository
export default new SessionsRepository();
