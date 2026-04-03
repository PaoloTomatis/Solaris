// Importazione moduli
import UserSettingsModel from '../models/UserSettings.model.js';
import type { IdType } from '../types/types.js';

// Respository impostazioni utenti
class UserSettingsRepository {
    // Funzione ricevi impostazioni utente
    async findOneByUserId(userId: IdType) {
        // Richiesta impostazioni utente
        const userSettings = UserSettingsModel.findOne({ userId }).lean();

        // Ritorno impostazioni utente
        return userSettings;
    }

    // Funzione creazione impostazioni utente
    async createOne(payload: {
        userId: IdType;
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
    async updateOneByUserId(
        userId: IdType,
        payload: {
            styleMode?: 'light' | 'dark';
            units?: 'metric' | 'imperial';
        },
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
    async deleteOneByUserId(userId: IdType) {
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
