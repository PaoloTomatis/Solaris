// Importazione moduli
import NotificationsModel, {
    type NotificationsType,
} from '../models/Notifications.model.js';
import { type FilterQuery, type ObjectId } from 'mongoose';
import {
    GetNotificationsQuerySchema,
    PostNotificationsBodySchema,
} from '../schemas/Notifications.schema.js';
import z from 'zod';

// Respository notifiche
class NotificationsRepository {
    // Funzione ricevi notifiche
    async findMany(payload: z.infer<typeof GetNotificationsQuerySchema>) {
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
        const query = NotificationsModel.find(filter);

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
    async createOne(
        payload: z.infer<typeof PostNotificationsBodySchema>,
        deviceId: string | ObjectId,
    ) {
        // Creazione notifica
        const notification = new NotificationsModel({ ...payload, deviceId });

        // Salvataggio notifica
        await notification.save();

        // Ritorno notifica
        return notification;
    }

    // Funzione eliminazione misurazioni
    async deleteManyByDevice(deviceId: string) {
        // Modifica dispositivi database
        await NotificationsModel.deleteMany({ deviceId });

        // Ritorno nullo
        return null;
    }
}

// Esportazione repository
export default new NotificationsRepository();
