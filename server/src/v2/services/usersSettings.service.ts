// Importazione moduli
import type { UserType } from '../types/types.js';
import usersSettingsRepository from '../repositories/usersSettings.repository.js';
import z from 'zod';
import { PatchUsersSettingsBodySchema } from '../schemas/UsersSettings.schema.js';
import dataParser from '../utils/dataParser.js';

// Servizio get /me/user-settings
async function getMeSettingsService(user?: UserType) {
    // Controllo utente
    if (!user) throw new Error('Invalid authentication');

    // Richiesta impostazioni utente database
    const userSettings = await usersSettingsRepository.findOne(user.id);

    // Controllo impostazioni utente
    if (!userSettings) throw new Error('User settings not found');

    // Conversione impostazioni utente
    const parsedUserSettings = dataParser(
        userSettings.toObject(),
        ['__v', 'schemaVersion'],
        true,
    );

    // Ritorno impostazioni utente
    return parsedUserSettings;
}

// Servizio patch /me/user-settings
async function patchMeSettingsService(
    payload: z.infer<typeof PatchUsersSettingsBodySchema>,
    user?: UserType,
) {
    // Controllo utente
    if (!user) throw new Error('Invalid authentication');

    // Modifica impostazioni utente
    const userSettings = await usersSettingsRepository.updateOne(
        payload,
        user.id,
    );

    // Controllo impostazioni utente
    if (!userSettings) throw new Error('Update of user settings failed');

    // Conversione impostazioni utente
    const parsedUserSettings = dataParser(
        userSettings.toObject(),
        ['__v', 'schemaVersion'],
        true,
    );

    // Ritorno impostazioni utente
    return parsedUserSettings;
}

// Esportazione servizi
export { getMeSettingsService, patchMeSettingsService };
