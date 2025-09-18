// Importazione moduli
import mongoose from 'mongoose';

// Interfaccia dispositivo
interface Device {
    _id: string;
    key: string;
    model: string;
    activatedAt: string;
    userId: string;
    mode: 'auto' | 'config' | 'safe';
}

// Schema dispositivo
const deviceSchema = new mongoose.Schema({
    key: String,
    model: String,
    activatedAt: String,
    userId: String,
    mode: String,
});

// Esportazione modello
export default mongoose.model<Device>('Device', deviceSchema);
