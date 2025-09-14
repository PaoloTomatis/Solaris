// Importazione moduli
import mongoose from 'mongoose';

// Schema impostazioni dispositivo
const deviceSettingsSchema = new mongoose.Schema({
    humMax: Number,
    humMin: Number,
    interval: Number,
    deviceId: String,
    updatedAt: String,
});

// Esportazione modello
export default mongoose.model('DeviceSettings', deviceSettingsSchema);
