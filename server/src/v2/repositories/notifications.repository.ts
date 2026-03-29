// Importazione moduli
import NotificationsModel, {
    type NotificationsType,
} from '../models/Notifications.model.js';
import { type FilterQuery } from 'mongoose';
import type { BaseManyRequest, IdType } from '../types/types.js';

// Respository notifiche
class NotificationsRepository {
    // Funzione ricevi notifiche
    async findMany(
        payload: BaseManyRequest & {
            deviceId?: IdType;
            type?: 'error' | 'warning' | 'info' | 'success';
        },
    ) {
        // Dichiarazione filtri
        const filter: FilterQuery<NotificationsType> = {
            deviceId: payload.deviceId,
        };

        // Controllo from/to
        if (payload.from || payload.to) {
            filter.measuredAt = {};
            if (payload.from) filter.measuredAt.$gte = payload.from;
            if (payload.to) filter.measuredAt.$lte = payload.to;
        }

        // Controllo type
        if (payload.type) filter.type = payload.type;

        // Richiesta notifica database
        const query = NotificationsModel.find(filter).lean();

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
        const notifications = await query;

        // Ritorno notifica
        return notifications;
    }

    // Funzione creazione notifica
    async createOne(payload: {
        deviceId: IdType;
        irrigationId?: IdType;
        measurementId?: IdType;
        title: string;
        description: string;
        type: 'error' | 'warning' | 'info' | 'success';
    }) {
        // Creazione notifica
        const notification = new NotificationsModel(payload);

        // Salvataggio notifica
        await notification.save();

        // Ritorno notifica
        return notification.toObject();
    }

    // Funzione eliminazione misurazioni
    async deleteManyByDevice(deviceId: IdType) {
        // Modifica dispositivi database
        const notifications = await NotificationsModel.deleteMany({
            deviceId,
        }).lean();

        // Ritorno notifiche
        return notifications;
    }
}

// Esportazione repository
export default new NotificationsRepository();
