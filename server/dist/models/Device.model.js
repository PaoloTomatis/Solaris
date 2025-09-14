// Importazione moduli
import mongoose from 'mongoose';
// Schema dispositivo
const deviceSchema = new mongoose.Schema({
    key: String,
    model: String,
    activatedAt: String,
    userId: String,
    mode: String,
});
// Esportazione modello
export default mongoose.model('Device', deviceSchema);
//# sourceMappingURL=Device.model.js.map