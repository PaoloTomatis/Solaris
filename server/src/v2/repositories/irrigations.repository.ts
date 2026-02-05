// Importazione moduli
import IrrigationsModel, {
    type IrrigationsType,
} from '../models/Irrigations.model.js';
import type { FilterQuery, ObjectId } from 'mongoose';
import {
    PostIrrigationsBodySchema,
    GetIrrigationsQuerySchema,
} from '../schemas/Irrigations.schema.js';
import z from 'zod';

// Respository irrigazioni
class IrrigationsRepository {
    // Funzione ricevi irrigazioni
    async findMany(payload: z.infer<typeof GetIrrigationsQuerySchema>) {
        // Dichiarazione filtri
        const filter: FilterQuery<IrrigationsType> = {
            deviceId: payload.deviceId,
        };

        // Controllo from/to
        if (payload.from || payload.to) {
            filter.irrigatedAt = {};
            if (payload.from) filter.irrigatedAt.$gte = payload.from;
            if (payload.to) filter.irrigatedAt.$lte = payload.to;
        }

        // Controllo type
        if (payload.type) filter.type = payload.type;

        // Richiesta irrigazione database
        const query = IrrigationsModel.find(filter);

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

    // Funzione creazione irrigazione
    async createOne(
        payload: z.infer<typeof PostIrrigationsBodySchema>,
        deviceId: string | ObjectId,
    ) {
        // Creazione irrigazione
        const irrigation = new IrrigationsModel({ ...payload, deviceId });

        // Salvataggio irrigazione
        await irrigation.save();

        // Ritorno irrigazione
        return irrigation;
    }

    // Funzione eliminazione misurazioni
    async deleteManyByDevice(deviceId: string) {
        // Modifica dispositivi database
        await IrrigationsModel.deleteMany({ deviceId });

        // Ritorno nullo
        return null;
    }
}

// Esportazione repository
export default new IrrigationsRepository();
