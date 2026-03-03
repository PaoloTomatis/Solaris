// Importazione moduli
import { Types, type UpdateQuery, type FilterQuery } from 'mongoose';
import DevicesModel, { type DevicesType } from '../models/Devices.model.js';
import type { GetDevicesQuerySchema } from '../schemas/Devices.schema.js';
import z from 'zod';

// Respository dispositivi
class DevicesRepository {
    // Funzione ricevi dispositivo da id
    async findOneById(id: string | Types.ObjectId) {
        // Richiesta dispositivo database
        const device = await DevicesModel.findById(id).lean();

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
    async findOneSafe(id: string, userId: string | Types.ObjectId) {
        // Richiesta dispositivo database
        const device = await DevicesModel.findOne({ _id: id, userId }).lean();

        // Ritorno dispositivo
        return device;
    }

    // Funzione ricevi dispositivi
    async findManySafe(payload: z.infer<typeof GetDevicesQuerySchema>) {
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
    async createOne(payload: Partial<DevicesType>) {
        // Creazione dispositivo
        const device = new DevicesModel(payload);

        // Salvataggio dispositivo
        await device.save();

        // Ritorno dispositivo
        return device.toObject();
    }

    // Funzione modifica dispositivo
    async updateOne(
        id: string | Types.ObjectId,
        payload: UpdateQuery<DevicesType>,
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
        id: string,
        userId: string | Types.ObjectId,
        payload: UpdateQuery<DevicesType>,
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
    async updateManyByUser(userId: string, payload: UpdateQuery<DevicesType>) {
        // Modifica dispositivi database
        const devices = await DevicesModel.updateMany({ userId }, payload, {
            runValidators: true,
        }).lean();

        // Ritorno dispositivi
        return devices;
    }

    // Funzione elimina dispositivo
    async deleteOne(id: string) {
        // Eliminazione dispositivo database
        const device = await DevicesModel.findByIdAndDelete(id, {
            runValidators: true,
        }).lean();

        // Ritorno dispositivo
        return device;
    }

    // Funzione elimina dispositivo sicura
    async deleteOneSafe(id: string, userId: string | Types.ObjectId) {
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
