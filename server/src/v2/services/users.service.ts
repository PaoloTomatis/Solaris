// Importazione moduli
import usersRepository from '../repositories/users.repository.js';
import type { UserType } from '../types/types.js';
import dataParser from '../utils/dataParser.js';

// Servizio get /me
async function getMeService(user?: UserType) {
    // Controllo utente
    if (!user) throw new Error('Invalid authentication');

    // Ritorno utente
    return user;
}

// Servizio delete /me
async function deleteMeService(user?: UserType) {
    // Controllo utente
    if (!user) throw new Error('Invalid authentication');

    // Eliminazione utente
    const oldUser = await usersRepository.deleteOne(user.id);

    // Controllo vecchio utente
    if (!oldUser) throw new Error('Deletion of the user failed');

    // Conversione utente
    const parsedUser = dataParser(
        oldUser.toObject(),
        ['psw', 'schemaVersion', '__v'],
        true,
    );

    // Ritorno utente
    return parsedUser;
}

// Esportazione servizi
export { getMeService, deleteMeService };
