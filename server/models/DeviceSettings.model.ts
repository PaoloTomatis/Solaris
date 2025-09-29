// Importazione moduli
import { Schema, model, type ObjectId } from 'mongoose';

// Interfaccia impostazioni dispositivo
interface DeviceSettingsType {
    _id: ObjectId;
    humMax: number;
    humMin: number;
    interval: number;
    deviceId: string;
    createdAt: Date;
    updatedAt: Date;
}

// Schema impostazioni dispositivo
const DeviceSettingsSchema = new Schema(
    {
        humMax: { type: Number, default: null },
        humMin: { type: Number, default: null },
        interval: { type: Number, default: null },
        deviceId: { type: Schema.Types.ObjectId, required: true, unique: true },
    },
    { timestamps: true }
);

// Esportazione modello
export default model<DeviceSettingsType>(
    'DeviceSettings',
    DeviceSettingsSchema
);
export type { DeviceSettingsType };
