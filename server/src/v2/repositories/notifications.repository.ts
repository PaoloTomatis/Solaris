// Importazione moduli
import NotificationsModel from '../models/Notifications.model.js';
import { type FilterQuery } from 'mongoose';
import { PostNotificationsBodySchema } from '../schemas/Notifications.schema.js';
import z from 'zod';

// Respository notifiche
class NotificationsRepository {
    // Funzione ricevi notifiche
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
        type: 'error' | 'warning' | 'info' | 'success';
    }) {
        // Dichiarazione filtri
        const filter: FilterQuery<typeof NotificationsModel> = {};

        // Controllo from/to
        if (from) filter.createdAt.$gte = from;
        if (to) filter.createdAt.$lte = to;

        // Controllo deviceId
        if (deviceId) filter.deviceId = deviceId;

        // Controllo type
        if (type) filter.type = type;

        // Richiesta notifica database
        const query = NotificationsModel.find(filter);

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
        const notifications = await query;

        // Ritorno notifica
        return notifications;
    }

    // Funzione creazione notifica
    async createOne(params: z.infer<typeof PostNotificationsBodySchema>) {
        // Creazione notifica
        const notification = new NotificationsModel(params);

        // Salvataggio notifica
        await notification.save();

        // Ritorno notifica
        return notification;
    }
}

// Esportazione repository
export default new NotificationsRepository();
