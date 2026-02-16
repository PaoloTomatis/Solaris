// Importazione moduli
import type { ObjectId, UpdateQuery, FilterQuery } from 'mongoose';
import DevicesModel, { type DevicesType } from '../models/Devices.model.js';
import type { GetDevicesQuerySchema } from '../schemas/Devices.schema.js';
import z from 'zod';
import type { UserType } from '../types/types.js';

// Respository dispositivi
class DevicesRepository {
    // Funzione ricevi dispositivo da id
    async findOneById(id: string | ObjectId) {
        // Richiesta dispositivo database
        const device = await DevicesModel.findById(id);

        // Ritorno dispositivo
        return device;
    }

    // Funzione ricevi dispositivo da key
    async findOneByKey(key: string) {
        // Richiesta dispositivo database
        const device = await DevicesModel.findOne({ key });

        // Ritorno dispositivo
        return device;
    }

    // Funzione ricevi dispositivo sicura
    async findOneSafe(id: string, userId: string | ObjectId) {
        // Richiesta dispositivo database
        const device = await DevicesModel.findOne({ _id: id, userId });

        // Ritorno dispositivo
        return device;
    }

    // Funzione ricevi dispositivi
    async findManySafe(
        payload: z.infer<typeof GetDevicesQuerySchema>,
        user: UserType,
    ) {
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
        const query = DevicesModel.find(filter);

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
        const irrigations = await query;

        // Ritorno irrigazione
        return irrigations;
    }

    // Funzione creazione dispositivo
    async createOne(payload: Partial<DevicesType>) {
        // Creazione dispositivo
        const device = new DevicesModel(payload);

        // Salvataggio dispositivo
        await device.save();

        // Ritorno dispositivo
        return device;
    }

    // Funzione modifica dispositivo
    async updateOne(id: string, payload: UpdateQuery<DevicesType>) {
        // Modifica dispositivo database
        const device = await DevicesModel.findByIdAndUpdate(id, payload, {
            new: true,
            runValidators: true,
        });

        // Ritorno dispositivo
        return device;
    }

    // Funzione modifica dispositivo sicura
    async updateOneSafe(
        id: string,
        userId: string | ObjectId,
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
        );

        // Ritorno dispositivo
        return device;
    }

    // Funzione modifica dispositivo
    async updateManyByUser(userId: string, payload: UpdateQuery<DevicesType>) {
        // Modifica dispositivi database
        await DevicesModel.updateMany({ userId }, payload, {
            runValidators: true,
        });

        // Ritorno nullo
        return null;
    }

    // Funzione elimina dispositivo
    async deleteOne(id: string) {
        // Eliminazione dispositivo database
        const device = await DevicesModel.findByIdAndDelete(id, {
            runValidators: true,
        });

        // Ritorno dispositivo
        return device;
    }

    // Funzione elimina dispositivo sicura
    async deleteOneSafe(id: string, userId: string | ObjectId) {
        // Eliminazione dispositivo database
        const device = await DevicesModel.findOneAndDelete(
            { _id: id, userId },
            {
                runValidators: true,
            },
        );

        // Ritorno dispositivo
        return device;
    }
}

// Esportazione repository
export default new DevicesRepository();
