// Importazione moduli
import DeviceSettingsModel from '../models/DeviceSettings.model.js';
import type { IdType } from '../types/types.js';

// Respository impostazioni dispositivi
class DeviceSettingsRepository {
    // Funzione ricevi impostazioni dispositivo
    async findOneByDeviceId(deviceId: IdType) {
        // Richiesta impostazioni dispositivo database
        const deviceSettings = await DeviceSettingsModel.findOne({
            deviceId,
        }).lean();

        // Ritorno impostazioni dispositivo
        return deviceSettings;
    }

    // Funzione creazione impostazioni dispositivo
    async createOne(payload: {
        deviceId: IdType;
        firmwareId?: IdType;
        mode?: 'config' | 'auto' | 'safe';
    }) {
        // Creazione impostazioni dispositivo
        const deviceSettings = new DeviceSettingsModel(payload);

        // Salvataggio impostazioni dispositivo
        await deviceSettings.save();

        // Ritorno impostazioni dispositivo
        return deviceSettings.toObject();
    }

    // Funzione modifica impostazioni dispositivo
    async updateOneByDeviceId(
        deviceId: IdType,
        payload: {
            firmwareId?: IdType;
            mode?: 'config' | 'auto' | 'safe';
            humIMax?: number | null;
            humIMin?: number | null;
            kInterval?: number | null;
            sensorHumIMin?: number;
            sensorHumIMax?: number;
            sensorLumMin?: number;
            sensorLumMax?: number;
        },
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
    async deleteOneByDeviceId(deviceId: IdType) {
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
