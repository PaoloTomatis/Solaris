// Importazione moduli
import mongoose from 'mongoose';

// Interfaccia impostazioni dispositivo
interface DeviceSettings {
    _id: string;
    humMax: number;
    humMin: number;
    interval: number;
    deviceId: string;
    updatedAt: string;
}

// Schema impostazioni dispositivo
const deviceSettingsSchema = new mongoose.Schema({
    humMax: Number,
    humMin: Number,
    interval: Number,
    deviceId: String,
    updatedAt: String,
});

// Esportazione modello
export default mongoose.model<DeviceSettings>(
    'DeviceSettings',
    deviceSettingsSchema
);
