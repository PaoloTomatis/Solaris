// Importazione moduli
import mongoose from 'mongoose';

// Schema dato
const dataSchema = new mongoose.Schema({
    date: String,
    humI: Number,
    humE: Number,
    temp: Number,
    deviceId: String,
    type: String,
});

// Esportazione modello
export default mongoose.model('Data', dataSchema);
