// Importazione moduli
import { type ObjectId, type FilterQuery } from 'mongoose';
import SessionsModel, { type SessionsType } from '../models/Sessions.model.js';

// Tipo input sessioni
interface SessionInput {
    userId?: string | ObjectId;
    deviceId?: string | ObjectId;
    refreshToken: string;
    ipAddress: string;
    userAgent: string;
    subject: 'device' | 'user';
    status: 'active' | 'expired' | 'revoked';
}

// Respository sessioni
class SessionsRepository {
    // Funzione richiesta sessioni da id utente
    async findMany(payload: {
        status?: 'active' | 'revoked' | 'expired';
        refreshToken?: string;
        userId?: string | ObjectId;
        deviceId?: string | ObjectId;
    }) {
        // Richiesta sessione database
        const sessions = await SessionsModel.find(payload);

        // Ritorno sessione
        return sessions;
    }

    // Funzione richiesta sessioni da id utente
    async findManyByUserId(
        userId: string | ObjectId,
        type?: 'active' | 'revoked' | 'expired',
    ) {
        // Dichiarazione filtri
        const filter: FilterQuery<SessionsType> = {
            userId,
            subject: 'user',
        };

        // Controllo type
        if (type) filter.status = type;

        // Richiesta sessione database
        const sessions = await SessionsModel.find(filter);

        // Ritorno sessione
        return sessions;
    }

    // Funzione richiesta sessioni da id utente
    async findManyByDeviceId(
        deviceId: string | ObjectId,
        type?: 'active' | 'revoked' | 'expired',
    ) {
        // Dichiarazione filtri
        const filter: FilterQuery<SessionsType> = {
            deviceId,
            subject: 'device',
        };

        // Controllo type
        if (type) filter.status = type;

        // Richiesta sessione database
        const sessions = await SessionsModel.find(filter);

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
        const sessions = await SessionsModel.find(filter);

        // Ritorno sessione
        return sessions;
    }

    // Firma funzione per utente
    async createOne(payload: {
        userId: string | ObjectId;
        refreshToken: string;
        ipAddress: string;
        userAgent: string;
        subject: 'user';
        status: 'active' | 'expired' | 'revoked';
    }): Promise<SessionsType>;

    // Firma funzione per dispositivo
    async createOne(payload: {
        deviceId: string | ObjectId;
        refreshToken: string;
        ipAddress: string;
        userAgent: string;
        subject: 'device';
        status: 'active' | 'expired' | 'revoked';
    }): Promise<SessionsType>;

    // Funzione creazione sessioni
    async createOne(payload: SessionInput) {
        // Creazione sessione database
        const session = new SessionsModel(payload);

        // Salvataggio sessione
        await session.save();

        // Ritorno sessione
        return session;
    }

    // Funzione creazione sessioni
    async updateOne(
        type: 'active' | 'revoked' | 'expired',
        id: string | ObjectId,
    ) {
        // Aggiornamento sessione database
        const session = await SessionsModel.findByIdAndUpdate(id, {
            status: type,
        });

        // Ritorno sessione
        return session;
    }

    // Funzione aggiornamento sessioni
    async updateUserMany(
        userId: string | ObjectId,
        type: 'active' | 'revoked' | 'expired',
    ) {
        // Aggiornamento sessione database
        const sessions = await SessionsModel.updateMany(
            { userId },
            {
                status: type,
            },
        );

        // Ritorno sessione
        return sessions;
    }

    // Funzione aggiornamento sessioni
    async updateDeviceMany(
        deviceId: string | ObjectId,
        type: 'active' | 'revoked' | 'expired',
    ) {
        // Aggiornamento sessione database
        const sessions = await SessionsModel.updateMany(
            { deviceId },
            {
                status: type,
            },
        );

        // Ritorno sessione
        return sessions;
    }
}

// Esportazione repository
export default new SessionsRepository();
