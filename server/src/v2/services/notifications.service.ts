// Importazione moduli
import type { DeviceType, UserType } from '../types/types.js';
import devicesRepository from '../repositories/devices.repository.js';
import usersRepository from '../repositories/users.repository.js';
import type {
    DeleteNotificationsQuerySchema,
    GetNotificationsQuerySchema,
    PostNotificationsBodySchema,
} from '../schemas/Notifications.schema.js';
import z from 'zod';
import notificationsRepository from '../repositories/notifications.repository.js';
import dataParser from '../utils/dataParser.js';

// Servizio get /notifications
async function getNotificationsService(
    payload: z.infer<typeof GetNotificationsQuerySchema>,
    user: UserType,
) {
    // Controllo utente
    if (!user) throw new Error('Invalid authentication');

    // Richiesta dispositivo database
    const device = await devicesRepository.findOneSafe(
        payload.deviceId,
        user.id,
    );

    // Controllo dispositivo
    if (!device)
        throw new Error(
            'The device does not exists or is owned by an other user',
        );

    // Richiesta notifica database
    const notifications = await notificationsRepository.findMany(payload);

    // Iterazione notifiche
    const parsedNotifications = notifications.map((notification) => {
        // Conversione notifica
        return dataParser(
            notification.toObject(),
            ['schemaVersion', '__v'],
            true,
        );
    });

    // Ritorno irrigazioni
    return parsedNotifications;
}

// Servizio post /notifications
async function postNotificationsService(
    payload: z.infer<typeof PostNotificationsBodySchema>,
    device: DeviceType,
) {
    // Controllo dispositivo
    if (!device) throw new Error('Invalid authentication');

    // Richiesta utente database
    const user = await usersRepository.findOneById(device.userId || '');

    // Controllo utente
    if (!user) throw new Error('The device must be owned by a user');

    // Creazione notifica database
    const notification = await notificationsRepository.createOne(
        payload,
        device.id,
    );

    // Conversione notifica
    const parsedNotification = dataParser(
        notification.toObject(),
        ['schemaVersion', '__v'],
        true,
    );

    // Ritorno notifica
    return parsedNotification;
}

// Servizio delete /notifications
async function deleteNotificationsService(
    payload: z.infer<typeof DeleteNotificationsQuerySchema>,
    user?: UserType,
) {
    // Controllo utente
    if (!user) throw new Error('Invalid authentication');

    // Richiesta dispositivo database
    const device = await devicesRepository.findOneSafe(
        payload.deviceId,
        user.id,
    );

    // Controllo dispositivo
    if (!device)
        throw new Error(
            'The device does not exists or is owned by an other user',
        );

    // Eliminazione notifiche database
    await notificationsRepository.deleteManyByDevice(payload.deviceId);

    // Ritorno null
    return null;
}

// Esportazione servizi
export {
    getNotificationsService,
    postNotificationsService,
    deleteNotificationsService,
};
