// Importazione moduli
import IrrigationsModel from '../models/Irrigations.model.js';
import { type FilterQuery } from 'mongoose';
import { PostIrrigationsBodySchema } from '../schemas/Irrigations.schema.js';
import z from 'zod';

// Respository irrigazioni
class IrrigationsRepository {
    // Funzione ricevi irrigazioni
    async findMany({
        deviceId,
        from,
        to,
        limit,
        sort,
        type,
    }: {
        deviceId?: string;
        from?: Date;
        to?: Date;
        limit: number;
        sort?: {
            field: string;
            order: 'asc' | 'desc';
        }[];
        type: 'config' | 'auto';
    }) {
        // Dichiarazione filtri
        const filter: FilterQuery<typeof IrrigationsModel> = {};

        // Controllo from/to
        if (from) filter.irrigatedAt.$gte = from;
        if (to) filter.irrigatedAt.$lte = to;

        // Controllo deviceId
        if (deviceId) filter.deviceId = deviceId;

        // Controllo type
        if (type) filter.type = type;

        // Richiesta irrigazione database
        const query = IrrigationsModel.find(filter);

        // Controllo lunghezza sort
        if (sort?.length) {
            const sortObj: Record<string, 1 | -1> = {};
            for (const s of sort) {
                sortObj[s.field] = s.order === 'asc' ? 1 : -1;
            }
            query.sort(sortObj);
        }

        // Impostazione limite
        query.limit(limit);

        // Esecuzione query
        const irrigations = await query;

        // Ritorno irrigazione
        return irrigations;
    }

    // Funzione creazione irrigazione
    async createOne(params: z.infer<typeof PostIrrigationsBodySchema>) {
        // Creazione irrigazione
        const irrigation = new IrrigationsModel(params);

        // Salvataggio irrigazione
        await irrigation.save();

        // Ritorno irrigazione
        return irrigation;
    }
}

// Esportazione repository
export default new IrrigationsRepository();
