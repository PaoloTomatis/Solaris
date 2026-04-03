// Importazione moduli
import MeasurementsModel, {
    type MeasurementsType,
} from '../models/Measurements.model.js';
import { type FilterQuery } from 'mongoose';
import type { IdType, BaseManyRequest } from '../types/types.js';

// Respository misurazioni
class MeasurementsRepository {
    // Funzione ricevi misurazioni
    async findMany(payload: BaseManyRequest & { deviceId?: IdType }) {
        // Dichiarazione filtri
        const filter: FilterQuery<MeasurementsType> = {
            deviceId: payload.deviceId,
        };

        // Controllo from/to
        if (payload.from || payload.to) {
            filter.measuredAt = {};
            if (payload.from) filter.measuredAt.$gte = payload.from;
            if (payload.to) filter.measuredAt.$lte = payload.to;
        }

        // Richiesta misurazione database
        const query = MeasurementsModel.find(filter).lean();

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
    async createOne(payload: {
        deviceId: IdType;
        temp: number;
        lum: number;
        humE: number;
        humI: number;
        measuredAt: Date;
    }) {
        // Creazione misurazione
        const measurement = new MeasurementsModel(payload);

        // Salvataggio misurazione
        await measurement.save();

        // Ritorno misurazione
        return measurement.toObject();
    }

    // Funzione eliminazione misurazioni
    async deleteManyByDevice(deviceId: IdType) {
        // Modifica dispositivi database
        await MeasurementsModel.deleteMany({ deviceId }).lean();

        // Ritorno nullo
        return null;
    }
}

// Esportazione repository
export default new MeasurementsRepository();
