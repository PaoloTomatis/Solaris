// Importazione moduli
import usersRepository from '../repositories/users.repository.js';
import type { UserType } from '../../global/types/types.js';

// Servizio get /me
async function getMeService(user?: UserType) {
    //TODO Errore custom
    // Controllo utente
    if (!user) throw new Error('Invalid authentication');

    // Ritorno utente
    return user;
}

// Servizio delete /me
async function deleteMeService(user?: UserType) {
    //TODO Errore custom
    // Controllo utente
    if (!user) throw new Error('Invalid authentication');

    // Eliminazione utente
    const oldUser = await usersRepository.deleteOne(user.id);

    //TODO Errore custom
    // Controllo vecchio utente
    if (!oldUser) throw new Error('Elimination of the user failed');

    // Ritorno utente
    return oldUser;
}

// Esportazione servizi
export { getMeService, deleteMeService };
