// Importazione moduli
import mongoose from 'mongoose';

// Interfaccia impostazioni utente
interface UserSettings {
    _id: string;
    styleMode: 'dark' | 'light';
    units: 'metric' | 'imperial';
    userId: number;
    updatedAt: string;
}

// Schema impostazioni utente
const userSettingsSchema = new mongoose.Schema({
    styleMode: String,
    units: String,
    userId: String,
    updatedAt: String,
});

// Esportazione modello
export default mongoose.model<UserSettings>('UserSettings', userSettingsSchema);
