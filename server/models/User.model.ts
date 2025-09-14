// Importazione moduli
import mongoose from 'mongoose';

// Schema utente
const userSchema = new mongoose.Schema({
    email: String,
    psw: String,
    refreshToken: String,
    createdAt: String,
});

// Esportazione modello
export default mongoose.model('User', userSchema);
