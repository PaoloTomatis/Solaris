// Importazione moduli
import { model, Schema, type ObjectId } from 'mongoose';

// Tipo impostazioni dispositivi
interface DevicesSettingsType {
    _id: ObjectId;
    deviceId: ObjectId;
    mode: 'config' | 'auto' | 'safe';
    humIMax?: number;
    humIMin?: number;
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
        humIMax: { type: Number, min: 0 },
        humIMin: { type: Number, min: 0 },
        kInterval: { type: Number, min: 1 },
        schemaVersion: { type: Number, default: 1 },
    },
    { timestamps: true }
);

// Esportazione modello impostazioni dispositivi
export default model<DevicesSettingsType>(
    'DevicesSettings',
    DevicesSettingsSchema
);
// Esportazione tipo impostazioni dispositivi
export type { DevicesSettingsType };
