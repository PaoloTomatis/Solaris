// Importazione moduli
import { Types } from 'mongoose';
import DeviceSettingsModel from '../models/DeviceSettings.model.js';
import { PatchDevicesSettingsBodySchema } from '../schemas/DevicesSettings.schema.js';
import z from 'zod';

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
        deviceId: string;
        firmwareVersion: string;
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
        payload: z.infer<typeof PatchDevicesSettingsBodySchema>,
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
