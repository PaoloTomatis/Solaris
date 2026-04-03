// Importazione moduli
import UsersModel from '../models/Users.model.js';
import type { IdType } from '../types/types.js';

// Respository utenti
class UsersRepository {
    // Funzione ricevi utente da id
    async findOneById(id: IdType) {
        // Richiesta utente database
        const user = await UsersModel.findById(id).lean();

        // Ritorno utente
        return user;
    }

    // Funzione ricevi utente da email
    async findOneByEmail(email: string) {
        // Richiesta utente database
        const user = await UsersModel.findOne({ email }).lean();

        // Ritorno utente
        return user;
    }

    // Funzione creazione utente
    async createOne(payload: {
        email: string;
        psw: string;
        role?: 'user' | 'admin';
    }) {
        // Creazione utente database
        const user = new UsersModel(payload);

        // Salvataggio utente
        await user.save();

        // Ritorno utente
        return user.toObject();
    }

    // Funzione elimina utente
    async deleteOneById(id: IdType) {
        // Eliminazione utente database
        const user = await UsersModel.findByIdAndDelete(id).lean();

        // Ritorno utente
        return user;
    }
}

// Esportazione repository
export default new UsersRepository();
