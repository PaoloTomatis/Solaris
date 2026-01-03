// Importazione moduli
import MeasurementsModel from '../models/Measurements.model.js';
import { type FilterQuery, type ObjectId } from 'mongoose';
import {
    GetMeasurementsQuerySchema,
    PostMeasurementsBodySchema,
} from '../schemas/Measurements.schema.js';
import z from 'zod';

// Respository misurazioni
class MeasurementsRepository {
    // Funzione ricevi misurazioni
    async findMany(payload: z.infer<typeof GetMeasurementsQuerySchema>) {
        // Dichiarazione filtri
        const filter: FilterQuery<typeof MeasurementsModel> = {
            deviceId: payload.deviceId,
        };

        // Controllo from/to
        if (payload.from || payload.to) {
            filter.measuredAt = {};
            if (payload.from) filter.measuredAt.$gte = payload.from;
            if (payload.to) filter.measuredAt.$lte = payload.to;
        }

        // Richiesta misurazione database
        const query = MeasurementsModel.find(filter);

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
        const measurements = await query;

        // Ritorno misurazione
        return measurements;
    }

    // Funzione creazione misurazione
    async createOne(
        payload: z.infer<typeof PostMeasurementsBodySchema>,
        deviceId: string | ObjectId
    ) {
        // Creazione misurazione
        const measurement = new MeasurementsModel({ ...payload, deviceId });

        // Salvataggio misurazione
        await measurement.save();

        // Ritorno misurazione
        return measurement;
    }
}

// Esportazione repository
export default new MeasurementsRepository();
