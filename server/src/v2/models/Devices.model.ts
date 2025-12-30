// Importazione moduli
import { model, Schema, type ObjectId } from 'mongoose';

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
        userId: { type: Schema.Types.ObjectId, ref: 'Users', required: true },
        key: { type: String, required: true, unique: true },
        name: { type: String, default: 'My Device' },
        psw: { type: String, required: true },
        prototypeModel: { type: String, default: 'Solaris Vega' },
        schemaVersion: { type: Number, default: 1 },
        activatedAt: { type: Date },
    },
    { timestamps: true }
);

// Esportazione modello dispositivi
export default model<DevicesType>('Devices', DevicesSchema);
// Esportazione tipo dispositivi
export type { DevicesType };
