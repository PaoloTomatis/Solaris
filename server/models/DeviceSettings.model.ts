// Importazione moduli
import { Schema, model } from 'mongoose';

// Interfaccia impostazioni dispositivo
interface DeviceSettings {
    _id: string;
    humMax: number;
    humMin: number;
    interval: number;
    deviceId: string;
    updatedAt: string;
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
export default model<DeviceSettings>('DeviceSettings', DeviceSettingsSchema);
