// Importazione moduli
import mongoose, { Schema, model, type ObjectId } from 'mongoose';
import DeviceModel from './Device.model.js';
import UserSettingsModel from './UserSettings.model.js';

// Interfaccia utente
interface UserType {
    _id: ObjectId;
    role: 'admin' | 'user';
    email: string;
    psw: string;
    refreshToken: string;
    updatedAt: Date;
    createdAt: Date;
}

// Schema utente
const UserSchema = new Schema(
    {
        role: { type: String, default: 'user', enum: ['admin', 'user'] },
        email: { type: String, required: true, unique: true },
        psw: { type: String, required: true },
        refreshToken: { type: String, required: false },
    },
    { timestamps: true }
);

// Middlewares
UserSchema.pre('findOneAndDelete', async function (next) {
    // Gestione errori
    try {
        // Ricavo utente database
        const user = await this.model.findOne(this.getQuery());

        // Controllo utente
        if (!user) return next();

        // Eliminazione impostazioni utente database
        await UserSettingsModel.deleteMany({ userId: user._id });

        // Modifica dispositivi database
        await DeviceModel.updateMany({ userId: user._id }, { userId: null });

        // Passaggio prossimo gestore
        next();
    } catch (error: any) {
        // Passaggio prossimo gestore con errore
        next(error);
    }
});

// Esportazione modello
export default model<UserType>('User', UserSchema);
export type { UserType };
