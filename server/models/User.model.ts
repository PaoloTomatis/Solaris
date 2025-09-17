// Importazione moduli
import mongoose from 'mongoose';

// Interfaccia utente
interface User {
    _id: number;
    email: string;
    psw: string;
    refreshToken: string;
    createdAt: string;
}

// Schema utente
const userSchema = new mongoose.Schema({
    email: String,
    psw: String,
    refreshToken: String,
    createdAt: String,
});

// Esportazione modello
export default mongoose.model<User>('User', userSchema);
