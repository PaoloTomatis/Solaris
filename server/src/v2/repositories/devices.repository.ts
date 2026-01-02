// Importazione moduli
import type { ObjectId, UpdateQuery } from 'mongoose';
import DevicesModel, { type DevicesType } from '../models/Devices.model.js';

// Respository dispositivi
class DevicesRepository {
    // Lista campi
    private selectedFields = '-psw -key -schemaVersion';

    // Funzione ricevi dispositivo
    async findOne(id: string) {
        // Richiesta dispositivo database
        const device = await DevicesModel.findById(id);

        // Ritorno dispositivo
        return device;
    }

    // Funzione ricevi dispositivo sicura
    async findOneSafe(id: string, userId: string | ObjectId) {
        // Richiesta dispositivo database
        const device = await DevicesModel.findOne({ _id: id, userId }).select(
            this.selectedFields
        );

        // Ritorno dispositivo
        return device;
    }

    // Funzione creazione dispositivo
    async createOne(payload: Partial<DevicesType>) {
        // Creazione dispositivo
        const device = new DevicesModel(payload);

        // Salvataggio dispositivo
        await device.save();

        // Ritorno dispositivo
        return device;
    }

    // Funzione modifica dispositivo
    async updateOne(id: string, payload: UpdateQuery<DevicesType>) {
        // Modifica dispositivo database
        const device = await DevicesModel.findByIdAndUpdate(id, payload, {
            new: true,
            runValidators: true,
        }).select(this.selectedFields);

        // Ritorno dispositivo
        return device;
    }

    // Funzione modifica dispositivo sicura
    async updateOneSafe(
        id: string,
        userId: string | ObjectId,
        payload: UpdateQuery<DevicesType>
    ) {
        // Modifica dispositivo database
        const device = await DevicesModel.findOneAndUpdate(
            { _id: id, userId },
            payload,
            {
                new: true,
                runValidators: true,
            }
        ).select(this.selectedFields);

        // Ritorno dispositivo
        return device;
    }

    // Funzione elimina dispositivo
    async deleteOne(id: string) {
        // Eliminazione dispositivo database
        const device = await DevicesModel.findByIdAndDelete(id, {
            runValidators: true,
        }).select(this.selectedFields);

        // Ritorno dispositivo
        return device;
    }

    // Funzione elimina dispositivo sicura
    async deleteOneSafe(id: string, userId: string | ObjectId) {
        // Eliminazione dispositivo database
        const device = await DevicesModel.findOneAndDelete(
            { _id: id, userId },
            {
                runValidators: true,
            }
        ).select(this.selectedFields);

        // Ritorno dispositivo
        return device;
    }
}

// Esportazione repository
export default new DevicesRepository();
