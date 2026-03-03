// Importazione moduli
import { Types } from 'mongoose';
import UserSettingsModel from '../models/UserSettings.model.js';
import { PatchUsersSettingsBodySchema } from '../schemas/UsersSettings.schema.js';
import z from 'zod';

// Respository impostazioni utenti
class UserSettingsRepository {
    // Funzione ricevi impostazioni utente
    async findOne(userId: string | Types.ObjectId) {
        // Richiesta impostazioni utente
        const userSettings = UserSettingsModel.findOne({ userId }).lean();

        // Ritorno impostazioni utente
        return userSettings;
    }

    // Funzione creazione impostazioni utente
    async createOne(payload: {
        userId: string;
        styleMode?: 'light' | 'dark';
        units?: 'metric' | 'imperial';
    }) {
        // Creazione impostazioni utente
        const userSettings = new UserSettingsModel(payload);

        // Salvataggio impostazioni utente
        await userSettings.save();

        // Ritorno impostazioni utente
        return userSettings.toObject();
    }

    // Funzione modifica impostazioni utente
    async updateOne(
        payload: z.infer<typeof PatchUsersSettingsBodySchema>,
        userId: string | Types.ObjectId,
    ) {
        // Modifica impostazioni utente database
        const userSettings = await UserSettingsModel.findOneAndUpdate(
            { userId },
            payload,
            { new: true },
        ).lean();

        // Ritorno impostazioni utente
        return userSettings;
    }

    // Funzione elimina impostazioni utente
    async deleteOne(userId: string) {
        // Modifica impostazioni utente database
        const userSettings = await UserSettingsModel.findOneAndDelete({
            userId,
        }).lean();

        // Ritorno impostazioni utente
        return userSettings;
    }
}

// Esportazione repository
export default new UserSettingsRepository();
