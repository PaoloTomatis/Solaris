// Importazione moduli
import type { ObjectId } from 'mongoose';
import UsersModel from '../models/Users.model.js';
import type { UsersRegisterBodySchema } from '../schemas/Authentication.schema.js';
import z from 'zod';

// Respository utenti
class UsersRepository {
    // Funzione ricevi utente da id
    async findOneById(id: string | ObjectId) {
        // Richiesta utente database
        const user = await UsersModel.findById(id);

        // Ritorno utente
        return user;
    }

    // Funzione ricevi utente da email
    async findOneByEmail(email: string) {
        // Richiesta utente database
        const user = await UsersModel.findOne({ email });

        // Ritorno utente
        return user;
    }

    // Funzione creazione utente
    async createOne(payload: z.infer<typeof UsersRegisterBodySchema>) {
        // Creazione utente database
        const user = new UsersModel(payload);

        // Salvataggio utente
        await user.save();

        // Ritorno utente
        return user;
    }

    // Funzione elimina utente
    async deleteOne(id: string | ObjectId) {
        // Eliminazione utente database
        const user = await UsersModel.findByIdAndDelete(id);

        // Ritorno utente
        return user;
    }
}

// Esportazione repository
export default new UsersRepository();
