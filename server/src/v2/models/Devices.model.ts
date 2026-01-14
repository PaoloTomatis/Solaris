// Importazione moduli
import { model, Schema, type ObjectId } from 'mongoose';
import devicesSettingsRepository from '../repositories/devicesSettings.repository.js';
import measurementsRepository from '../repositories/measurements.repository.js';
import irrigationsRepository from '../repositories/irrigations.repository.js';
import notificationsRepository from '../repositories/notifications.repository.js';

// Tipo dispositivi
interface DevicesType {
    _id: ObjectId;
    userId: ObjectId;
    key: string;
    name: string;
    psw: string;
    prototypeModel: string;
    schemaVersion: number;
    activatedAt: Date;
    updatedAt: Date;
    createdAt: Date;
}

// Schema dispositivi
const DevicesSchema = new Schema(
    {
        userId: { type: Schema.Types.ObjectId, ref: 'Users' },
        key: { type: String, required: true, unique: true },
        name: { type: String, default: 'My Device' },
        psw: { type: String, required: true },
        prototypeModel: { type: String, default: 'Solaris Vega' },
        schemaVersion: { type: Number, default: 1 },
        activatedAt: { type: Date },
    },
    { timestamps: true }
);

// Middleware creazione dispositivo
DevicesSchema.post('save', async (doc, next) => {
    // Creazione impostazioni dispositivo database
    await devicesSettingsRepository.createOne({ deviceId: doc._id.toString() });

    // Prossimo middleware
    next();
});

// Middleware eliminazione dispositivo
DevicesSchema.post('deleteOne', async (doc, next) => {
    // Controllo doc
    if (!doc) next();

    // Eliminazione impostazioni dispositivo database
    await devicesSettingsRepository.deleteOne(doc._id.toString() as string);

    // Eliminazione misurazioni dispositivo database
    await measurementsRepository.deleteManyByDevice(
        doc._id.toString() as string
    );

    // Eliminazione irrigazioni dispositivo database
    await irrigationsRepository.deleteManyByDevice(
        doc._id.toString() as string
    );

    // Eliminazione notifiche dispositivo database
    await notificationsRepository.deleteManyByDevice(
        doc._id.toString() as string
    );

    // Prossimo middleware
    next();
});

// Esportazione modello dispositivi
export default model<DevicesType>('Devices', DevicesSchema);
// Esportazione tipo dispositivi
export type { DevicesType };
