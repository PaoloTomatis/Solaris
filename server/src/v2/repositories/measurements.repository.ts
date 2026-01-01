// Importazione moduli
import MeasurementsModel from '../models/Measurements.model.js';
import { type FilterQuery } from 'mongoose';
import { PostMeasurementsBodySchema } from '../schemas/Measurements.schema.js';
import z from 'zod';

// Respository misurazioni
class MeasurementsRepository {
    // Funzione ricevi misurazioni
    async findMany({
        deviceId,
        from,
        to,
        limit,
        sort,
    }: {
        deviceId?: string;
        from?: Date;
        to?: Date;
        limit: number;
        sort?: {
            field: string;
            order: 'asc' | 'desc';
        }[];
    }) {
        // Dichiarazione filtri
        const filter: FilterQuery<typeof MeasurementsModel> = {};

        // Controllo from/to
        if (from) filter.measuredAt.$gte = from;
        if (to) filter.measuredAt.$lte = to;

        // Controllo deviceId
        if (deviceId) filter.deviceId = deviceId;

        // Richiesta misurazione database
        const query = MeasurementsModel.find(filter);

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
        const measurements = await query;

        // Ritorno misurazione
        return measurements;
    }

    // Funzione creazione misurazione
    async createOne(params: z.infer<typeof PostMeasurementsBodySchema>) {
        // Creazione misurazione
        const measurement = new MeasurementsModel(params);

        // Salvataggio misurazione
        await measurement.save();

        // Ritorno misurazione
        return measurement;
    }
}

// Esportazione repository
export default new MeasurementsRepository();
