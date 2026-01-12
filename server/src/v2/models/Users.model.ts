// Importazione moduli
import { model, Schema, type ObjectId } from 'mongoose';
import usersSettingsRepository from '../repositories/usersSettings.repository.js';
import devicesRepository from '../repositories/devices.repository.js';

// Tipo utenti
interface UsersType {
    _id: ObjectId;
    email: string;
    psw: string;
    role: 'user' | 'admin';
    schemaVersion: number;
    updatedAt: Date;
    createdAt: Date;
}

// Schema utenti
const UsersSchema = new Schema(
    {
        email: { type: String, required: true, unique: true },
        psw: { type: String, required: true },
        role: { type: String, default: 'user', enum: ['user', 'admin'] },
        schemaVersion: { type: Number, default: 1 },
    },
    { timestamps: true }
);

// Middleware creazione utente
UsersSchema.post('save', async (doc, next) => {
    // Creazione impostazioni utente database
    await usersSettingsRepository.createOne({ userId: doc._id.toString() });

    // Prossimo middleware
    next();
});

// Middleware eliminazione utente
UsersSchema.post('findOneAndDelete', async (doc, next) => {
    // Controllo doc
    if (!doc) next();

    // Eliminazione impostazioni utente database
    await usersSettingsRepository.deleteOne(doc._id.toString() as string);

    // Modifica dispositivi database
    await devicesRepository.updateManyByUser(doc._id.toString() as string, {
        userId: null,
    });

    // Prossimo middleware
    next();
});

// Esportazione modello utenti
export default model<UsersType>('Users', UsersSchema);
// Esportazione tipo utenti
export type { UsersType };
