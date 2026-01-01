// Importazione moduli
import UserSettingsModel from '../models/UserSettings.model.js';
import { PatchUsersSettingsBodySchema } from '../schemas/UsersSettings.schema.js';
import z from 'zod';

// Respository impostazioni utenti
class UserSettingsRepository {
    // Funzione creazione impostazioni utente
    async createOne(params: {
        userId: string;
        styleMode?: 'light' | 'dark';
        units?: 'metric' | 'imperial';
    }) {
        // Creazione impostazioni utente
        const userSettings = new UserSettingsModel(params);

        // Salvataggio impostazioni utente
        await userSettings.save();

        // Ritorno impostazioni utente
        return userSettings;
    }

    // Funzione modifica impostazioni utente
    async updateOne(
        userId: string,
        params: z.infer<typeof PatchUsersSettingsBodySchema>
    ) {
        // Modifica impostazioni utente database
        const userSettings = await UserSettingsModel.findOneAndUpdate(
            { userId },
            params,
            { new: true }
        );

        // Ritorno impostazioni utente
        return userSettings;
    }
}

// Esportazione repository
export default new UserSettingsRepository();
