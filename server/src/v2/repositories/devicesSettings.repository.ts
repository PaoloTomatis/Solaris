// Importazione moduli
import { Types } from 'mongoose';
import DeviceSettingsModel from '../models/DeviceSettings.model.js';

// Respository impostazioni dispositivi
class DeviceSettingsRepository {
    // Funzione ricevi impostazioni dispositivo
    async findOne(deviceId: string | Types.ObjectId) {
        // Richiesta impostazioni dispositivo database
        const deviceSettings = await DeviceSettingsModel.findOne({
            deviceId,
        }).lean();

        // Ritorno impostazioni dispositivo
        return deviceSettings;
    }

    // Funzione creazione impostazioni dispositivo
    async createOne(payload: {
        deviceId: string | Types.ObjectId;
        firmwareId?: string | Types.ObjectId | undefined | null;
        mode?: 'config' | 'auto' | 'safe';
        humIMax?: number;
        humIMin?: number;
        kInterval?: number;
    }) {
        // Creazione impostazioni dispositivo
        const deviceSettings = new DeviceSettingsModel(payload);

        // Salvataggio impostazioni dispositivo
        await deviceSettings.save();

        // Ritorno impostazioni dispositivo
        return deviceSettings.toObject();
    }

    // Funzione modifica impostazioni dispositivo
    async updateOne(
        payload: {
            firmwareId?: string | Types.ObjectId;
            mode?: 'config' | 'auto' | 'safe' | undefined | null;
            humIMax?: number | undefined | null;
            humIMin?: number | undefined | null;
            kInterval?: number | undefined | null;
        },
        deviceId: string | Types.ObjectId,
    ) {
        // Modifica impostazioni dispositivo database
        const deviceSettings = await DeviceSettingsModel.findOneAndUpdate(
            { deviceId },
            payload,
            { new: true },
        ).lean();

        // Ritorno impostazioni dispositivo
        return deviceSettings;
    }

    // Funzione elimina impostazioni dispositivo
    async deleteOne(deviceId: string) {
        // Modifica impostazioni dispositivo database
        const deviceSettings = await DeviceSettingsModel.findOneAndDelete({
            deviceId,
        }).lean();

        // Ritorno impostazioni dispositivo
        return deviceSettings;
    }
}

// Esportazione repository
export default new DeviceSettingsRepository();
