// Importazione moduli
import type { Request, Response } from 'express';
import resHandler from '../../v1/utils/responseHandler.js';
import DeviceSettingsModel from '../models/DeviceSettings.model.js';
import DeviceModel from '../models/Device.model.js';
import type { DeviceType, UserType } from '../types/types.js';
import mongoose from 'mongoose';

// Gestore get devices settings
async function getDeviceSettings(
    req: Request,
    res: Response
): Promise<Response> {
    // Gestione errori
    try {
        // Ricavo dati richiesta
        const user: UserType | undefined = req.user;
        const device: DeviceType | undefined = req.device;
        const { deviceId, id: settingsId }: { deviceId?: string; id?: string } =
            req.query;

        // Lista filtri
        const filter: {
            _id?: mongoose.Types.ObjectId;
            deviceId?: mongoose.Types.ObjectId;
        } = {};

        // Controllo utente
        if (!user && !device)
            return resHandler(
                res,
                401,
                null,
                'Autenticazione non eseguita correttamente!',
                false
            );

        // Controllo settingsId
        if (settingsId) {
            if (!mongoose.isValidObjectId(settingsId))
                return resHandler(
                    res,
                    400,
                    null,
                    'Campo "id" invalido!',
                    false
                );

            // Impostazione settingsId
            filter._id = new mongoose.Types.ObjectId(settingsId);
        }

        // Controllo deviceId
        if (deviceId) {
            if (!mongoose.isValidObjectId(deviceId))
                return resHandler(
                    res,
                    400,
                    null,
                    'Campo "deviceId" invalido!',
                    false
                );

            // Impostazione deviceId
            filter.deviceId = new mongoose.Types.ObjectId(deviceId);
        } else if (device) {
            filter.deviceId = new mongoose.Types.ObjectId(device.id);
        }

        // Ricavo impostazioni dispositivo database
        const deviceSettings = await DeviceSettingsModel.findOne(filter);

        // Controllo impostazioni dispositivo
        if (!deviceSettings)
            return resHandler(
                res,
                404,
                null,
                'Impostazioni dispositivo non esistenti!',
                false
            );

        if (user) {
            // Ricavo dispositivo database
            const userDevices = await DeviceModel.find({ userId: user.id });

            // Lista id dispositivi
            const devicesId = userDevices.map((userDevice) => userDevice._id);

            // Controllo impostazioni dispositivo
            if (
                !devicesId
                    .map((d) => d.toString())
                    .includes(deviceSettings.deviceId.toString())
            )
                return resHandler(
                    res,
                    403,
                    null,
                    "Il dispositivo che possiede queste impostazioni non appartiene all'account autenticato!",
                    false
                );
        }

        // Risposta finale
        return resHandler(
            res,
            200,
            {
                id: deviceSettings._id.toString(),
                humMax: deviceSettings.humMax,
                humMin: deviceSettings.humMin,
                interval: deviceSettings.interval,
                deviceId: deviceSettings.deviceId.toString(),
                updatedAt: deviceSettings.updatedAt,
                createdAt: deviceSettings.createdAt,
            },
            'Impostazioni dispositivo ricavate con successo!',
            true
        );
    } catch (error: unknown) {
        // Errore in console
        console.error(error);
        const errorMsg =
            error instanceof Error
                ? error?.message || 'Errore interno del server!'
                : 'Errore sconosciuto!';
        // Risposta finale
        return resHandler(res, 500, null, errorMsg, false);
    }
}

// Gestore patch device settings
async function patchDeviceSettings(
    req: Request,
    res: Response
): Promise<Response> {
    // Gestione errori
    try {
        // Ricavo dati richiesta
        const user: UserType | undefined = req.user;
        let {
            humMax,
            humMin,
            interval,
        }: {
            humMax?: number | null;
            humMin?: number | null;
            interval?: number | null;
        } = req.body;
        const { id: deviceId }: { id?: string } = req.params;
        const errors: string[] = [];

        // Controllo utente
        if (!user)
            return resHandler(
                res,
                401,
                null,
                'Autenticazione non eseguita correttamente!',
                false
            );

        // Controllo deviceId
        if (!mongoose.isValidObjectId(deviceId))
            return resHandler(
                res,
                400,
                null,
                'Campo "id" mancante o invalido!',
                false
            );

        // Controllo humMax
        if (isNaN(Number(humMax))) {
            humMax = null;
            errors.push("l'umidità massima è invalida o mancante");
        }

        // Controllo humMin
        if (isNaN(Number(humMin))) {
            humMin = null;
            errors.push("l'umidità minima è invalida o mancante");
        }

        // Controllo interval
        if (isNaN(Number(interval))) {
            interval = null;
            errors.push("l'intervallo è invalido o mancante");
        }

        // Ricavo dispositivo database
        const device = await DeviceModel.findById(deviceId);

        // Controllo device
        if (device?.userId.toString() !== user.id.toString())
            return resHandler(
                res,
                403,
                null,
                "Il dispositivo che possiede queste impostazioni non appartiene all'account autenticato!",
                false
            );

        // Aggiornamento o creazione impostazioni dispositivo database
        const deviceSettings = await DeviceSettingsModel.findOneAndUpdate(
            { deviceId },
            { humMax, humMin, interval },
            { new: true, upsert: true }
        );

        // Controllo impostazioni dispositivo
        if (!deviceSettings)
            return resHandler(
                res,
                404,
                null,
                'Impostazioni dispositivo non trovate!',
                false
            );

        // Risposta finale
        return resHandler(
            res,
            200,
            {
                id: deviceSettings._id.toString(),
                humMax: deviceSettings.humMax,
                humMin: deviceSettings.humMin,
                interval: deviceSettings.interval,
                deviceId: deviceSettings.deviceId.toString(),
                updatedAt: deviceSettings.updatedAt,
                createdAt: deviceSettings.createdAt,
            },
            'Impostazioni utente modificate con successo!' +
                (errors.length ? ` (${errors.join(', ')})` : ''),
            true
        );
    } catch (error: unknown) {
        // Errore in console
        console.error(error);
        const errorMsg =
            error instanceof Error
                ? error?.message || 'Errore interno del server!'
                : 'Errore sconosciuto!';
        // Risposta finale
        return resHandler(res, 500, null, errorMsg, false);
    }
}

// Gestore delete device settings
async function deleteDeviceSettings(
    req: Request,
    res: Response
): Promise<Response> {
    // Gestione errori
    try {
        // Ricavo dati richiesta
        const user: UserType | undefined = req.user;
        const { id: deviceId }: { id?: string } = req.params;

        // Controllo utente
        if (!user)
            return resHandler(
                res,
                401,
                null,
                'Autenticazione non eseguita correttamente!',
                false
            );

        // Controllo deviceId
        if (!mongoose.isValidObjectId(deviceId))
            return resHandler(
                res,
                400,
                null,
                'Campo "id" mancante o invalido!',
                false
            );

        // Ricavo dispositivo database
        const device = await DeviceModel.findById(deviceId);

        // Controllo device
        if (!device || device.userId.toString() !== user.id.toString())
            return resHandler(
                res,
                403,
                null,
                "Il dispositivo che possiede queste impostazioni non appartiene all'account autenticato!",
                false
            );

        // Eliminazione impostazioni dispositivo database
        const deviceSettings = await DeviceSettingsModel.findOneAndDelete({
            deviceId,
        });

        // Controllo impostazioni dispositivo
        if (!deviceSettings)
            return resHandler(
                res,
                404,
                null,
                'Impostazioni dispositivo non trovate!',
                false
            );

        // Risposta finale
        return resHandler(
            res,
            200,
            {
                id: deviceSettings._id.toString(),
                humMax: deviceSettings.humMax,
                humMin: deviceSettings.humMin,
                interval: deviceSettings.interval,
                deviceId: deviceSettings.deviceId.toString(),
                updatedAt: deviceSettings.updatedAt,
                createdAt: deviceSettings.createdAt,
            },
            'Impostazioni dispositivo eliminate con successo!',
            true
        );
    } catch (error: unknown) {
        // Errore in console
        console.error(error);
        const errorMsg =
            error instanceof Error
                ? error?.message || 'Errore interno del server!'
                : 'Errore sconosciuto!';
        // Risposta finale
        return resHandler(res, 500, null, errorMsg, false);
    }
}

// Esportazione gestori
export { getDeviceSettings, patchDeviceSettings, deleteDeviceSettings };
