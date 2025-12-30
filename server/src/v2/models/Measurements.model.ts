// Importazione moduli
import { model, Schema, type ObjectId } from 'mongoose';

// Tipo misurazioni
interface MeasurementsType {
    _id: ObjectId;
    deviceId: ObjectId;
    temp: number;
    lum: number;
    humE: number;
    humI: number;
    schemaVersion: number;
    measuredAt: Date;
    updatedAt: Date;
    createdAt: Date;
}

// Schema misurazioni
const MeasurementsSchema = new Schema(
    {
        deviceId: {
            type: Schema.Types.ObjectId,
            ref: 'Devices',
            required: true,
        },
        temp: { type: Number, required: true, min: -50, max: 100 },
        lum: { type: Number, required: true, min: 0, max: 100 },
        humE: { type: Number, required: true, min: 0, max: 100 },
        humI: { type: Number, required: true, min: 0, max: 100 },
        schemaVersion: { type: Number, default: 1 },
        measuredAt: { type: Date, default: () => new Date() },
    },
    { timestamps: true }
);

// Esportazione modello misurazioni
export default model<MeasurementsType>('Measurements', MeasurementsSchema);
// Esportazione tipo misurazioni
export type { MeasurementsType };
