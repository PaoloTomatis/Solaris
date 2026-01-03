// Importazione moduli
import { model, Schema, type ObjectId } from 'mongoose';

// Tipo notifiche
interface NotificationsType {
    _id: ObjectId;
    deviceId: ObjectId;
    irrigationId?: ObjectId;
    measurementId?: ObjectId;
    title: string;
    description: string;
    type: 'error' | 'warning' | 'info' | 'success';
    schemaVersion: number;
    updatedAt: Date;
    createdAt: Date;
}

// Schema notifiche
const NotificationsSchema = new Schema(
    {
        deviceId: {
            type: Schema.Types.ObjectId,
            ref: 'Devices',
            required: true,
        },
        irrigationId: { type: Schema.Types.ObjectId, ref: 'Irrigations' },
        measurementId: { type: Schema.Types.ObjectId, ref: 'Measurements' },
        title: { type: String, required: true },
        description: { type: String, required: true },
        type: {
            type: String,
            required: true,
            enum: ['error', 'warning', 'info', 'success'],
        },
        schemaVersion: { type: Number, default: 1 },
    },
    { timestamps: true }
);

// Definizione indici
NotificationsSchema.index({ createdAt: 1, updatedAt: 1 });

// Esportazione modello notifiche
export default model<NotificationsType>('Notifications', NotificationsSchema);
// Esportazione tipo notifiche
export type { NotificationsType };
