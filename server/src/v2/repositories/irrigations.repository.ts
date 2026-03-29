// Importazione moduli
import IrrigationsModel, {
    type IrrigationsType,
} from '../models/Irrigations.model.js';
import { type FilterQuery } from 'mongoose';
import type { BaseManyRequest, IdType } from '../types/types.js';

// Respository irrigazioni
class IrrigationsRepository {
    // Funzione ricevi irrigazioni
    async findMany(
        payload: BaseManyRequest & {
            deviceId?: IdType;
            type?: 'config' | 'auto';
        },
    ) {
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
        const query = IrrigationsModel.find(filter).lean();

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
    async createOne(payload: {
        deviceId: IdType;
        temp: number;
        lum: number;
        humE: number;
        humIBefore: number;
        humIAfter: number;
        interval: number;
        type: 'config' | 'auto';
        irrigatedAt: Date;
    }) {
        // Creazione irrigazione
        const irrigation = new IrrigationsModel(payload);

        // Salvataggio irrigazione
        await irrigation.save();

        // Ritorno irrigazione
        return irrigation.toObject();
    }

    // Funzione eliminazione misurazioni
    async deleteManyByDevice(deviceId: IdType) {
        // Modifica dispositivi database
        await IrrigationsModel.deleteMany({ deviceId }).lean();

        // Ritorno nullo
        return null;
    }
}

// Esportazione repository
export default new IrrigationsRepository();
