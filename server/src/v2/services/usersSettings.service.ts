// Importazione moduli
import type { UserType } from '../types/types.js';
import usersSettingsRepository from '../repositories/usersSettings.repository.js';
import z from 'zod';
import { PatchUsersSettingsBodySchema } from '../schemas/UsersSettings.schema.js';

// Servizio get /me/user-settings
async function getMeSettingsService(user?: UserType) {
    //TODO Errore custom
    // Controllo utente
    if (!user) throw new Error('Invalid authentication');

    // Richiesta impostazioni utente database
    const userSettings = await usersSettingsRepository.findOne(user.id);

    //TODO Errore custom
    // Controllo vecchio utente
    if (!userSettings) throw new Error('User settings not found');

    // Ritorno utente
    return userSettings;
}

// Servizio patch /me/user-settings
async function patchMeSettingsService(
    payload: z.infer<typeof PatchUsersSettingsBodySchema>,
    user?: UserType
) {
    //TODO Errore custom
    // Controllo utente
    if (!user) throw new Error('Invalid authentication');

    // Eliminazione utente
    const userSettings = await usersSettingsRepository.updateOne(
        payload,
        user.id
    );

    //TODO Errore custom
    // Controllo vecchio utente
    if (!userSettings) throw new Error('Update of user settings failed');

    // Ritorno utente
    return userSettings;
}

// Esportazione servizi
export { getMeSettingsService, patchMeSettingsService };
