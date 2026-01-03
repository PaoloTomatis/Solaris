// Importazione moduli
import type { DeviceType, UserType } from '../types/types.js';
import devicesRepository from '../repositories/devices.repository.js';
import usersRepository from '../repositories/users.repository.js';
import type {
    GetNotificationsQuerySchema,
    PostNotificationsBodySchema,
} from '../schemas/Notifications.schema.js';
import z from 'zod';
import notificationsRepository from '../repositories/notifications.repository.js';

// Servizio get /notifications
async function getNotificationsService(
    payload: z.infer<typeof GetNotificationsQuerySchema>,
    user: UserType
) {
    //TODO Errore custom
    // Controllo utente
    if (!user) throw new Error('Invalid authentication');

    // Richiesta dispositivo database
    const device = devicesRepository.findOneSafe(payload.deviceId, user.id);

    //TODO Errore custom
    // Controllo dispositivo
    if (!device)
        throw new Error(
            "The device does not exists or the user isn't allowed to get it"
        );

    // Richiesta notifica database
    const notifications = await notificationsRepository.findMany(payload);

    // Ritorno irrigazioni
    return notifications;
}

// Servizio post /notifications
async function postNotificationsService(
    payload: z.infer<typeof PostNotificationsBodySchema>,
    device: DeviceType
) {
    //TODO Errore custom
    // Controllo dispositivo
    if (!device) throw new Error('Invalid authentication');

    // Richiesta utente database
    const user = usersRepository.findOne(device.userId || '');

    // Controllo utente
    if (!user) throw new Error('The device must be owned by a user');

    // Creazione notifica database
    const notification = notificationsRepository.createOne(payload, device.id);

    // Ritorno notifica
    return notification;
}

// Esportazione servizi
export { getNotificationsService, postNotificationsService };
