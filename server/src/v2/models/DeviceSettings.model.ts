// Importazione moduli
import { model, Schema, Types } from 'mongoose';

// Tipo impostazioni dispositivi
interface DevicesSettingsType {
    _id: Types.ObjectId;
    deviceId: Types.ObjectId;
    mode: 'config' | 'auto' | 'safe';
    humIMax?: number;
    humIMin?: number;
    sensorHumIMin?: number;
    sensorHumIMax?: number;
    sensorLumMin?: number;
    sensorLumMax?: number;
    kInterval?: number;
    schemaVersion: number;
    updatedAt: Date;
    createdAt: Date;
}

// Schema impostazioni dispositivi
const DevicesSettingsSchema = new Schema(
    {
        deviceId: {
            type: Schema.Types.ObjectId,
            ref: 'Devices',
            required: true,
        },
        mode: {
            type: String,
            default: 'config',
            enum: ['config', 'auto', 'safe'],
        },
        humIMax: { type: Number, min: 0, max: 100 },
        humIMin: { type: Number, min: 0, max: 100 },
        sensorHumIMin: { type: Number, min: 0, max: 100 },
        sensorHumIMax: { type: Number, min: 0, max: 100 },
        sensorLumMax: { type: Number, min: 0, max: 100 },
        sensorLumMin: { type: Number, min: 0, max: 100 },
        kInterval: { type: Number, min: 1 },
        schemaVersion: { type: Number, default: 1 },
    },
    { timestamps: true },
);

// Esportazione modello impostazioni dispositivi
export default model<DevicesSettingsType>(
    'DevicesSettings',
    DevicesSettingsSchema,
);
// Esportazione tipo impostazioni dispositivi
export type { DevicesSettingsType };
