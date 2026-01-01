// Importazione moduli
import DeviceSettingsModel from '../models/DeviceSettings.model.js';
import { PatchDevicesSettingsBodySchema } from '../schemas/DevicesSettings.schema.js';
import z from 'zod';

// Respository impostazioni dispositivi
class DeviceSettingsRepository {
    // Funzione ricevi impostazioni dispositivo
    async findOne(deviceId: string) {
        // Richiesta utente database
        const user = await DeviceSettingsModel.findOne({ deviceId });

        // Ritorno utente
        return user;
    }

    // Funzione creazione impostazioni dispositivo
    async createOne(params: {
        deviceId: string;
        mode?: 'config' | 'auto' | 'safe';
        humIMax?: number;
        humIMin?: number;
        kInterval?: number;
    }) {
        // Creazione impostazioni dispositivo
        const deviceSettings = new DeviceSettingsModel(params);

        // Salvataggio impostazioni dispositivo
        await deviceSettings.save();

        // Ritorno impostazioni dispositivo
        return deviceSettings;
    }

    // Funzione modifica impostazioni dispositivo
    async updateOne(
        userId: string,
        params: z.infer<typeof PatchDevicesSettingsBodySchema>
    ) {
        // Modifica impostazioni dispositivo database
        const deviceSettings = await DeviceSettingsModel.findOneAndUpdate(
            { userId },
            params,
            { new: true }
        );

        // Ritorno impostazioni dispositivo
        return deviceSettings;
    }
}

// Esportazione repository
export default new DeviceSettingsRepository();
