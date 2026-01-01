// Importazione moduli
import DevicesModel from '../models/Devices.model.js';
import type {
    PatchDevicesBodySchema,
    PostDevicesBodySchema,
} from '../schemas/Devices.schema.js';
import z from 'zod';

// Respository dispositivi
class DevicesRepository {
    // Funzione ricevi dispositivo
    async findOne(id: string) {
        // Richiesta dispositivo database
        const device = await DevicesModel.findById(id);

        // Ritorno dispositivo
        return device;
    }

    // Funzione creazione dispositivo
    async createOne(params: z.infer<typeof PostDevicesBodySchema>) {
        // Creazione dispositivo
        const device = new DevicesModel(params);

        // Salvataggio dispositivo
        await device.save();

        // Ritorno dispositivo
        return device;
    }

    // Funzione modifica dispositivo
    async updateOne(
        id: string,
        params: z.infer<typeof PatchDevicesBodySchema>
    ) {
        // Modifica dispositivo database
        const device = await DevicesModel.findByIdAndUpdate(id, params, {
            new: true,
        });

        // Ritorno dispositivo
        return device;
    }

    // Funzione elimina dispositivo
    async deleteOne(id: string) {
        // Richiesta dispositivo database
        const device = await DevicesModel.findByIdAndDelete(id);

        // Ritorno dispositivo
        return device;
    }
}

// Esportazione repository
export default new DevicesRepository();
