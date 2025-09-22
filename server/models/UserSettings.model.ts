// Importazione moduli
import { Schema, model, type ObjectId } from 'mongoose';

// Interfaccia impostazioni utente
interface UserSettings {
    _id: ObjectId;
    styleMode: 'dark' | 'light';
    units: 'metric' | 'imperial';
    userId: number;
    updatedAt: Date;
    createdAt: Date;
}

// Schema impostazioni utente
const UserSettingsSchema = new Schema(
    {
        userId: {
            type: Schema.Types.ObjectId,
            required: true,
            unique: true,
            ref: 'User',
        },
        styleMode: { type: String, enum: ['light', 'dark'], default: 'light' },
        units: {
            type: String,
            enum: ['metric', 'imperial'],
            default: 'metric',
        },
    },
    { timestamps: true }
);

// Esportazione modello
export default model<UserSettings>('UserSettings', UserSettingsSchema);
