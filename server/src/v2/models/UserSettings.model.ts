// Importazione moduli
import { model, Schema, type ObjectId } from 'mongoose';

// Tipo impostazioni utenti
interface UsersSettingsType {
    _id: ObjectId;
    userId: ObjectId;
    styleMode: 'light' | 'dark';
    units: 'metric' | 'imperial';
    schemaVersion: number;
    updatedAt: Date;
    createdAt: Date;
}

// Schema impostazioni utenti
const UsersSettingsSchema = new Schema(
    {
        userId: { type: Schema.Types.ObjectId, ref: 'Users', required: true },
        styleMode: {
            type: String,
            default: 'light',
            enum: ['light', 'dark'],
        },
        units: {
            type: String,
            default: 'metric',
            enum: ['metric', 'imperial'],
        },
        schemaVersion: { type: Number, default: 1 },
    },
    { timestamps: true }
);

// Esportazione modello impostazioni utenti
export default model<UsersSettingsType>('UsersSettings', UsersSettingsSchema);
// Esportazione tipo impostazioni utenti
export type { UsersSettingsType };
