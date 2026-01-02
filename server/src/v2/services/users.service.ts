// Importazione moduli
import type { UsersType } from '../models/Users.model.js';
import usersRepository from '../repositories/users.repository.js';

// Servizio get /me
async function getMeService(user?: UsersType) {
    //TODO Errore custom
    // Controllo utente
    if (!user) throw new Error('Invalid authentication');

    // Ritorno utente
    return user;
}

// Servizio delete /me
async function deleteMeService(user?: UsersType) {
    //TODO Errore custom
    // Controllo utente
    if (!user) throw new Error('Invalid authentication');

    // Eliminazione utente
    const oldUser = await usersRepository.deleteOne(user._id);

    //TODO Errore custom
    // Controllo vecchio utente
    if (!oldUser) throw new Error('Elimination of the user failed');

    // Ritorno utente
    return oldUser;
}

// Esportazione servizi
export { getMeService, deleteMeService };
