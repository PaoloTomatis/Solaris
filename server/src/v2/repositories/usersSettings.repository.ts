// Importazione moduli
import type { ObjectId } from 'mongoose';
import UserSettingsModel from '../models/UserSettings.model.js';
import { PatchUsersSettingsBodySchema } from '../schemas/UsersSettings.schema.js';
import z from 'zod';

// Respository impostazioni utenti
class UserSettingsRepository {
    // Funzione ricevi impostazioni utente
    async findOne(userId: string | ObjectId) {
        // Richiesta impostazioni utente
        const userSettings = UserSettingsModel.findOne({ userId });

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
        return userSettings;
    }

    // Funzione modifica impostazioni utente
    async updateOne(
        payload: z.infer<typeof PatchUsersSettingsBodySchema>,
        userId: string
    ) {
        // Modifica impostazioni utente database
        const userSettings = await UserSettingsModel.findOneAndUpdate(
            { userId },
            payload,
            { new: true }
        );

        // Ritorno impostazioni utente
        return userSettings;
    }
}

// Esportazione repository
export default new UserSettingsRepository();
