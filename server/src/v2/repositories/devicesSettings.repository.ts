// Importazione moduli
import type { ObjectId } from 'mongoose';
import DeviceSettingsModel from '../models/DeviceSettings.model.js';
import { PatchDevicesSettingsBodySchema } from '../schemas/DevicesSettings.schema.js';
import z from 'zod';

// Respository impostazioni dispositivi
class DeviceSettingsRepository {
    // Funzione ricevi impostazioni dispositivo
    async findOne(deviceId: string | ObjectId) {
        // Richiesta impostazioni dispositivo database
        const deviceSettings = await DeviceSettingsModel.findOne({ deviceId });

        // Ritorno impostazioni dispositivo
        return deviceSettings;
    }

    // Funzione creazione impostazioni dispositivo
    async createOne(payload: {
        deviceId: string;
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
        return deviceSettings;
    }

    // Funzione modifica impostazioni dispositivo
    async updateOne(
        payload: z.infer<typeof PatchDevicesSettingsBodySchema>,
        deviceId: string | ObjectId
    ) {
        // Modifica impostazioni dispositivo database
        const deviceSettings = await DeviceSettingsModel.findOneAndUpdate(
            { deviceId },
            payload,
            { new: true }
        );

        // Ritorno impostazioni dispositivo
        return deviceSettings;
    }
}

// Esportazione repository
export default new DeviceSettingsRepository();
