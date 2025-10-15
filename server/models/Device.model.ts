// Importazione moduli
import { Schema, model, type ObjectId } from 'mongoose';

// Interfaccia dispositivo
interface DeviceType {
    _id: ObjectId;
    key: string;
    psw: string;
    prototype: string;
    name: string;
    activatedAt: Date;
    userId: ObjectId;
    mode: 'auto' | 'config' | 'safe';
    updatedAt: Date;
    createdAt: Date;
}

// const passwordAlphabet =
//     'abcdefghijklmnopqrstuvwxyz' +
//     'ABCDEFGHIJKLMNOPQRSTUVWXYZ' +
//     '0123456789' +
//     '!@#$%^&*()_-+=[]{}|;:,.<>?';

// Schema dispositivo
const DeviceSchema = new Schema(
    {
        key: { type: String, required: true, unique: true },
        psw: { type: String, required: true },
        prototype: { type: String, default: 'Solaris Vega V1' },
        name: { type: String, default: 'My Device' },
        activatedAt: { type: Date, default: () => new Date() },
        userId: { type: Schema.Types.ObjectId, ref: 'User' },
        mode: {
            type: String,
            enum: ['config', 'auto', 'safe'],
            default: 'config',
        },
    },
    { timestamps: true }
);

// Esportazione modello
export default model<DeviceType>('Device', DeviceSchema);
export type { DeviceType };
