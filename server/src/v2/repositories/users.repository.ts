// Importazione moduli
import UsersModel from '../models/Users.model.js';

// Respository utenti
class UsersRepository {
    // Funzione ricevi utente
    async findOne(id: string) {
        // Richiesta utente database
        const user = await UsersModel.findById(id);

        // Ritorno utente
        return user;
    }

    // Funzione elimina utente
    async deleteOne(id: string) {
        // Richiesta utente database
        const user = await UsersModel.findByIdAndDelete(id);

        // Ritorno utente
        return user;
    }
}

// Esportazione repository
export default new UsersRepository();
