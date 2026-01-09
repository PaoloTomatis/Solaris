// Importazione moduli
import type { DeviceType, UserType } from '../types/types.js';
import devicesRepository from '../repositories/devices.repository.js';
import usersRepository from '../repositories/users.repository.js';
import type {
    GetMeasurementsQuerySchema,
    PostMeasurementsBodySchema,
} from '../schemas/Measurements.schema.js';
import z from 'zod';
import measurementsRepository from '../repositories/measurements.repository.js';
import dataParser from '../utils/dataParser.js';

// Servizio get /measurements
async function getMeasurementsService(
    payload: z.infer<typeof GetMeasurementsQuerySchema>,
    user: UserType
) {
    //TODO Errore custom
    // Controllo utente
    if (!user) throw new Error('Invalid authentication');

    // Richiesta dispositivo database
    const device = await devicesRepository.findOneSafe(
        payload.deviceId,
        user.id
    );

    //TODO Errore custom
    // Controllo dispositivo
    if (!device)
        throw new Error(
            "The device does not exists or the user isn't allowed to get it"
        );

    // Richiesta misurazione database
    const measurements = await measurementsRepository.findMany(payload);

    // Iterazione misurazioni
    measurements.map((measurement) => {
        // Conversione misurazione
        return dataParser(
            measurement.toObject(),
            ['schemaVersion', '__v'],
            true
        );
    });

    // Ritorno irrigazioni
    return measurements;
}

// Servizio post /measurements
async function postMeasurementsService(
    payload: z.infer<typeof PostMeasurementsBodySchema>,
    device: DeviceType
) {
    //TODO Errore custom
    // Controllo dispositivo
    if (!device) throw new Error('Invalid authentication');

    // Richiesta utente database
    const user = await usersRepository.findOneById(device.userId || '');

    // Controllo utente
    if (!user) throw new Error('The device must be owned by a user');

    // Creazione misurazione database
    const measurement = await measurementsRepository.createOne(
        payload,
        device.id
    );

    // Conversione misurazione
    const parsedMeasurement = dataParser(
        measurement.toObject(),
        ['schemaVersion', '__v'],
        true
    );

    // Ritorno misurazione
    return parsedMeasurement;
}

// Esportazione servizi
export { getMeasurementsService, postMeasurementsService };
