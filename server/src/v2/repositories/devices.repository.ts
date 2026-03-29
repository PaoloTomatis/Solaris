// Importazione moduli
import { type FilterQuery } from 'mongoose';
import DevicesModel, { type DevicesType } from '../models/Devices.model.js';
import type { BaseManyRequest, IdType } from '../types/types.js';

// Respository dispositivi
class DevicesRepository {
    // Funzione ricevi dispositivo da id
    async findOneById(id: IdType) {
        // Richiesta dispositivo database
        const device = await DevicesModel.findById(id).lean();

        // Ritorno dispositivo
        return device;
    }

    // Funzione ricevi dispositivo da id
    async findOne(payload: { userId: IdType; prototypeModel: string }) {
        // Richiesta dispositivo database
        const device = await DevicesModel.findOne(payload).lean();

        // Ritorno dispositivo
        return device;
    }

    // Funzione ricevi dispositivo da key
    async findOneByKey(key: string) {
        // Richiesta dispositivo database
        const device = await DevicesModel.findOne({ key }).lean();

        // Ritorno dispositivo
        return device;
    }

    // Funzione ricevi dispositivo sicura
    async findOneSafe(id: string, userId: IdType) {
        // Richiesta dispositivo database
        const device = await DevicesModel.findOne({ _id: id, userId }).lean();

        // Ritorno dispositivo
        return device;
    }

    // Funzione ricevi dispositivi
    async findManySafe(payload: BaseManyRequest & { deviceId?: IdType }) {
        // Dichiarazione filtri
        const filter: FilterQuery<DevicesType> = {
            deviceId: payload.deviceId,
        };

        // Controllo from/to
        if (payload.from || payload.to) {
            filter.activatedAt = {};
            if (payload.from) filter.activatedAt.$gte = payload.from;
            if (payload.to) filter.activatedAt.$lte = payload.to;
        }

        // Richiesta irrigazione database
        const query = DevicesModel.find(filter).lean();

        // Controllo lunghezza sort
        if (payload.sort?.length) {
            const sortObj: Record<string, 1 | -1> = {};
            for (const s of payload.sort) {
                sortObj[s.field] = s.order === 'asc' ? 1 : -1;
            }
            query.sort(sortObj);
        }

        // Impostazione limite
        query.limit(payload.limit);

        // Esecuzione query
        const devices = await query;

        // Ritorno irrigazione
        return devices;
    }

    // Funzione creazione dispositivo
    async createOne(payload: {
        userId?: IdType;
        key: string;
        name?: string;
        psw: string;
        prototypeModel?: string;
    }) {
        // Creazione dispositivo
        const device = new DevicesModel(payload);

        // Salvataggio dispositivo
        await device.save();

        // Ritorno dispositivo
        return device.toObject();
    }

    // Funzione modifica dispositivo
    async updateOneById(
        id: IdType,
        payload: {
            userId?: IdType;
            name?: string;
            activatedAt?: Date;
        },
    ) {
        // Modifica dispositivo database
        const device = await DevicesModel.findByIdAndUpdate(id, payload, {
            new: true,
            runValidators: true,
        }).lean();

        // Ritorno dispositivo
        return device;
    }

    // Funzione modifica dispositivo sicura
    async updateOneSafe(
        id: IdType,
        userId: IdType,
        payload: {
            userId?: IdType;
            name?: string;
            activatedAt?: Date;
        },
    ) {
        // Modifica dispositivo database
        const device = await DevicesModel.findOneAndUpdate(
            { _id: id, userId },
            payload,
            {
                new: true,
                runValidators: true,
            },
        ).lean();

        // Ritorno dispositivo
        return device;
    }

    // Funzione modifica dispositivo
    async updateManyByUserId(
        userId: string,
        payload: {
            userId?: IdType | null;
            name?: string;
            activatedAt?: Date;
        },
    ) {
        // Modifica dispositivi database
        const devices = await DevicesModel.updateMany({ userId }, payload, {
            runValidators: true,
        }).lean();

        // Ritorno dispositivi
        return devices;
    }

    // Funzione elimina dispositivo
    async deleteOneById(id: IdType) {
        // Eliminazione dispositivo database
        const device = await DevicesModel.findByIdAndDelete(id, {
            runValidators: true,
        }).lean();

        // Ritorno dispositivo
        return device;
    }

    // Funzione elimina dispositivo sicura
    async deleteOneSafe(id: IdType, userId: IdType) {
        // Eliminazione dispositivo database
        const device = await DevicesModel.findOneAndDelete(
            { _id: id, userId },
            {
                runValidators: true,
            },
        ).lean();

        // Ritorno dispositivo
        return device;
    }
}

// Esportazione repository
export default new DevicesRepository();
