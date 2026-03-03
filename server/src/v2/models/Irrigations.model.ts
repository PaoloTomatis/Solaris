// Importazione moduli
import { model, Schema, Types } from 'mongoose';

// Tipo irrigazioni
interface IrrigationsType {
    _id: Types.ObjectId;
    deviceId: Types.ObjectId;
    temp: number;
    lum: number;
    humE: number;
    humIBefore: number;
    humIAfter: number;
    interval: number;
    type: 'config' | 'auto';
    schemaVersion: number;
    irrigatedAt: Date;
    updatedAt: Date;
    createdAt: Date;
}

// Schema irrigazioni
const IrrigationsSchema = new Schema(
    {
        deviceId: {
            type: Types.ObjectId,
            ref: 'Devices',
            required: true,
        },
        temp: { type: Number, required: true, min: -50, max: 100 },
        lum: { type: Number, required: true, min: 0, max: 100 },
        humE: { type: Number, required: true, min: 0, max: 100 },
        humIBefore: { type: Number, required: true, min: 0, max: 100 },
        humIAfter: { type: Number, required: true, min: 0, max: 100 },
        interval: { type: Number, required: true, min: 1 },
        type: { type: String, required: true, enum: ['auto', 'config'] },
        schemaVersion: { type: Number, default: 1 },
        irrigatedAt: { type: Date, default: () => new Date() },
    },
    { timestamps: true },
);

// Definizione indici
IrrigationsSchema.index({ createdAt: 1, updatedAt: 1, irrigatedAt: 1 });

// Esportazione modello irrigazioni
export default model<IrrigationsType>('Irrigations', IrrigationsSchema);
// Esportazione tipo irrigazioni
export type { IrrigationsType };
