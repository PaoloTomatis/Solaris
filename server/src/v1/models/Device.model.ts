// Importazione moduli
import { Schema, model, type ObjectId } from 'mongoose';
import DataModel from './Data.model.js';
import DeviceSettingsModel from './DeviceSettings.model.js';

// Interfaccia dispositivo
interface DeviceType {
    _id: ObjectId;
    key: string;
    psw: string;
    prototypeModel: string;
    name: string;
    activatedAt: Date;
    userId: ObjectId;
    mode: 'auto' | 'config' | 'safe';
    updatedAt: Date;
    createdAt: Date;
}

// Schema dispositivo
const DeviceSchema = new Schema(
    {
        key: { type: String, required: true, unique: true },
        psw: { type: String, required: true },
        prototypeModel: { type: String, default: 'Solaris Vega' },
        name: { type: String, default: 'My Device' },
        activatedAt: { type: Date, default: () => new Date() },
        userId: { type: Schema.Types.ObjectId, ref: 'User' },
        mode: {
            type: String,
            enum: ['config', 'auto', 'safe'],
            default: 'config',
        },
    },
    { timestamps: true }
);

// Middlewares
DeviceSchema.pre('findOneAndDelete', async function (next) {
    // Gestione errori
    try {
        // Ricavo dispositivo database
        const device = await this.model.findOne(this.getQuery());

        // Controllo dispositivo
        if (!device) return next();

        // Eliminazione impostazioni dispositivo database
        await DeviceSettingsModel.deleteMany({ deviceId: device._id });

        // Eliminazione impostazioni utente database
        await DataModel.deleteMany({ deviceId: device._id });

        // Passaggio prossimo gestore
        next();
    } catch (error: any) {
        // Passaggio prossimo gestore con errore
        next(error);
    }
});

// Esportazione modello
export default model<DeviceType>('Device', DeviceSchema);
export type { DeviceType };
