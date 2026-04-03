// Importazione moduli
import { model, Schema, Types } from 'mongoose';

// Tipo versioni dispositivi
interface DevicesVersionsType {
    _id: Types.ObjectId;
    notes?: string;
    prototypeModel: string;
    channel: 'stable' | 'beta' | 'dev';
    mandatory: boolean;
    filepath: string;
    firmwareVersion: string;
    schemaVersion: number;
    updatedAt: Date;
    createdAt: Date;
}

// Schema versioni dispositivi
const DevicesVersionsSchema = new Schema(
    {
        notes: {
            type: String,
        },
        prototypeModel: { type: String, required: true },
        channel: {
            type: String,
            default: 'dev',
            enum: ['stable', 'beta', 'dev'],
        },
        mandatory: { type: Boolean, default: false },
        filepath: { type: String, required: true },
        firmwareVersion: {
            type: String,
            required: true,
        },
        schemaVersion: { type: Number, default: 1 },
    },
    { timestamps: true },
);

// Esportazione modello versioni dispositivi
export default model<DevicesVersionsType>(
    'DevicesVersions',
    DevicesVersionsSchema,
);
// Esportazione tipo versioni dispositivi
export type { DevicesVersionsType };
