// Importazione moduli
import mongoose from 'mongoose';

// Interfaccia dati
interface Data {
    _id: string;
    date: string;
    humI: number | [number, number];
    humE: number;
    temp: number;
    lum: number;
    deviceId: string;
    type:
        | 'log_error'
        | 'log_info'
        | 'log_warning'
        | 'log_irrigation_auto'
        | 'log_irrigation_config'
        | 'data_config'
        | 'data_auto';
}

// Schema dato
const dataSchema = new mongoose.Schema({
    date: String,
    humI: Number,
    humE: Number,
    temp: Number,
    lum: Number,
    deviceId: String,
    type: String,
});

// Esportazione modello
export default mongoose.model<Data>('Data', dataSchema);
