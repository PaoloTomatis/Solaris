// Importazione moduli
import mongoose from 'mongoose';

// Schema impostazioni utente
const userSettingsSchema = new mongoose.Schema({
    styleMode: String,
    units: String,
    userId: String,
    updatedAt: String,
});

// Esportazione modello
export default mongoose.model('UserSettings', userSettingsSchema);
