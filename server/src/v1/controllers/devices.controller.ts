// Importazione moduli
import type { Request, Response } from 'express';
import type { UserType } from '../../global/types/types.js';
import type { DataType } from '../models/Data.model.js';
import resHandler from '../../v1/utils/responseHandler.js';
import DeviceModel from '../models/Device.model.js';
import mongoose from 'mongoose';
import { v4 as uuid } from 'uuid';
import bcrypt from 'bcrypt';
import pswGenerator from '../../global/utils/pswGenerator.js';
import DataModel from '../models/Data.model.js';
import { emitToRoom } from '../../global/utils/wsRoomHandlers.js';
import DeviceSettingsModel from '../models/DeviceSettings.model.js';
import {
    algorithmHumX,
    algorithmInterval,
} from '../../global/utils/irrigationAlgorithm.js';

// Gestore get devices
async function getDevices(req: Request, res: Response): Promise<Response> {
    // Gestione errori
    try {
        // Ricavo dati richiesta
        const user: UserType | undefined = req.user;
        const {
            id,
            key,
            name,
            prototypeModel,
            activatedAt,
            mode,
            limit,
        }: {
            id?: string;
            key?: string;
            name?: string;
            prototypeModel?: string;
            activatedAt?: string;
            mode?: 'config' | 'auto' | 'safe';
            limit?: string;
        } = req.query;

        // Lista filtri
        const filter: {
            _id?: mongoose.Types.ObjectId;
            key?: string;
            name?: string;
            prototypeModel?: string;
            activatedAt?: Date;
            mode?: 'config' | 'auto' | 'safe';
            userId?: mongoose.Types.ObjectId;
            limit?: number;
        } = {};

        // Controllo utente
        if (!user)
            return resHandler(
                res,
                401,
                null,
                'Autenticazione non eseguita correttamente!',
                false
            );

        // Controllo id
        if (id) {
            if (!mongoose.Types.ObjectId.isValid(id))
                return resHandler(
                    res,
                    400,
                    null,
                    'Campo "id" invalido nella richiesta!',
                    false
                );

            // Impostazione id
            filter._id = new mongoose.Types.ObjectId(id);
        }

        // Controllo key
        if (key) {
            if (typeof key !== 'string')
                return resHandler(
                    res,
                    400,
                    null,
                    'Campo "key" invalido nella richiesta!',
                    false
                );

            // Impostazione key
            filter.key = key;
        }

        // Controllo name
        if (name) {
            if (
                typeof name !== 'string' ||
                name.length > 255 ||
                name.length < 3
            )
                return resHandler(
                    res,
                    400,
                    null,
                    'Campo "name" invalido nella richiesta!',
                    false
                );

            // Impostazione name
            filter.name = name;
        }

        // Controllo prototypeModel
        if (prototypeModel) {
            if (typeof prototypeModel !== 'string')
                return resHandler(
                    res,
                    400,
                    null,
                    'Campo "prototypeModel" invalido nella richiesta!',
                    false
                );

            // Impostazione prototypeModel
            filter.prototypeModel = prototypeModel;
        }

        // Controllo activatedAt
        if (activatedAt) {
            const date = new Date(activatedAt);
            if (isNaN(date.getTime()))
                return resHandler(
                    res,
                    400,
                    null,
                    'Campo "activatedAt" invalido!',
                    false
                );
            // Impostazione activatedAt
            filter.activatedAt = date;
        }

        // Controllo mode
        if (mode) {
            if (!['config', 'auto', 'safe'].includes(mode))
                return resHandler(
                    res,
                    400,
                    null,
                    'Campo "mode" invalido nella richiesta!',
                    false
                );

            // Impostazione mode
            filter.mode = mode;
        }

        // Impostazione userId
        filter.userId = new mongoose.Types.ObjectId(user.id);

        // Costruzione query
        const query = DeviceModel.find(filter);

        // Controllo limite
        if (limit && parseInt(limit) > 0) query.limit(parseInt(limit));

        // Ricavo dispositivi database
        const devices = await query;

        // Risposta finale
        return resHandler(
            res,
            200,
            devices.map((device) => {
                return {
                    id: device._id.toString(),
                    key: device.key,
                    name: device.name,
                    prototypeModel: device.prototypeModel,
                    userId: device.userId?.toString(),
                    mode: device.mode,
                    activatedAt: device.activatedAt,
                    updatedAt: device.updatedAt,
                    createdAt: device.createdAt,
                };
            }),
            'Dispositivi ricavati con successo!',
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

// Gestore post devices
async function postDevice(req: Request, res: Response): Promise<Response> {
    // Gestione errori
    try {
        // Ricavo dati richiesta
        const user: UserType | undefined = req.user;
        const {
            key,
            psw,
            name,
            prototypeModel,
            activatedAt,
            mode,
        }: {
            key?: string;
            psw?: string;
            name?: string;
            prototypeModel?: string;
            activatedAt?: string;
            mode?: 'config' | 'auto' | 'safe';
        } = req.body;

        // Lista filtri
        const data: {
            key?: string;
            psw?: string;
            name?: string;
            prototypeModel?: string;
            activatedAt?: Date;
            mode?: 'config' | 'auto' | 'safe';
        } = {};

        // Controllo utente
        if (!user)
            return resHandler(
                res,
                401,
                null,
                'Autenticazione non eseguita correttamente!',
                false
            );

        // Controllo ruolo utente
        if (user.role !== 'admin')
            return resHandler(
                res,
                403,
                null,
                "L'operazione di creazione di un dispositivo è riservata agli amministratori!",
                false
            );

        // Controllo key
        if (key) {
            if (typeof key !== 'string')
                return resHandler(
                    res,
                    400,
                    null,
                    'Campo "key" invalido nella richiesta!',
                    false
                );

            // Impostazione key
            data.key = key;
        } else {
            data.key = uuid();
        }

        // Controllo name
        if (name) {
            if (
                typeof name !== 'string' ||
                name.length > 255 ||
                name.length < 3
            )
                return resHandler(
                    res,
                    400,
                    null,
                    'Campo "name" invalido nella richiesta!',
                    false
                );

            // Impostazione key
            data.name = name;
        }

        // Controllo prototypeModel
        if (prototypeModel) {
            if (typeof prototypeModel !== 'string')
                return resHandler(
                    res,
                    400,
                    null,
                    'Campo "prototypeModel" invalido nella richiesta!',
                    false
                );

            // Impostazione prototypeModel
            data.prototypeModel = prototypeModel;
        }

        // Controllo activatedAt
        if (activatedAt) {
            const date = new Date(activatedAt);
            if (isNaN(date.getTime()))
                return resHandler(
                    res,
                    400,
                    null,
                    'Campo "activatedAt" invalido!',
                    false
                );
            // Impostazione activatedAt
            data.activatedAt = date;
        }

        // Controllo mode
        if (mode) {
            if (!['config', 'auto', 'safe'].includes(mode))
                return resHandler(
                    res,
                    400,
                    null,
                    'Campo "mode" invalido nella richiesta!',
                    false
                );

            // Impostazione mode
            data.mode = mode;
        }

        // Controllo psw
        if (psw) {
            console.log(psw);
            if (psw.length < 8 || psw.length > 255)
                return resHandler(
                    res,
                    400,
                    null,
                    'Campo "psw" invalido nella richiesta!',
                    false
                );

            // Impostazione psw
            data.psw = await bcrypt.hash(psw, 10);
        } else {
            // Generazione password
            const _psw = pswGenerator();
            console.log(_psw);

            // Impostazione psw
            data.psw = await bcrypt.hash(_psw, 10);
        }

        // Creazione dispositivo database
        const device = new DeviceModel(data);
        // Salvataggio dispositivo
        await device.save();

        // Controllo dispositivo
        if (!device)
            return resHandler(
                res,
                500,
                null,
                'Dispositivo non creato correttamente!',
                false
            );

        // Creazione impostazioni dispositivo database
        const deviceSettings = new DeviceSettingsModel({
            deviceId: device._id.toString(),
        });
        // Salvataggio impostazioni dispositivo
        await deviceSettings.save();

        // Controllo impostazioni dispositivo
        if (!deviceSettings)
            return resHandler(
                res,
                500,
                null,
                'Impostazioni dispositivo non crate correttamente!',
                false
            );

        // Risposta finale
        return resHandler(
            res,
            201,
            {
                id: device._id.toString(),
                key: device.key,
                name: device.name,
                prototypeModel: device.prototypeModel,
                userId: device.userId?.toString(),
                mode: device.mode,
                activatedAt: device.activatedAt,
                updatedAt: device.updatedAt,
                createdAt: device.createdAt,
            },
            'Dispositivo creato con successo!',
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

// Gestore patch devices
async function patchDevice(req: Request, res: Response): Promise<Response> {
    // Gestione errori
    try {
        // Ricavo dati richiesta
        const user: UserType | undefined = req.user;
        const {
            name,
            activatedAt,
            mode,
            userId,
        }: {
            name?: string;
            activatedAt?: string;
            mode?: 'config' | 'auto' | 'safe';
            userId?: string;
        } = req.body;
        const { id: deviceId }: { id?: string } = req.params;

        // Lista modifiche
        const data: {
            name?: string;
            activatedAt?: Date;
            mode?: 'config' | 'auto' | 'safe';
            userId?: mongoose.Types.ObjectId | null;
        } = {};

        // Controllo utente
        if (!user)
            return resHandler(
                res,
                401,
                null,
                'Autenticazione non eseguita correttamente!',
                false
            );

        // Controllo id dispositivo
        if (!deviceId || typeof deviceId !== 'string')
            return resHandler(
                res,
                400,
                null,
                'Id del dispositivo mancante o invalida!',
                false
            );

        // Controllo name
        if (name) {
            if (
                typeof name !== 'string' ||
                name.length > 255 ||
                name.length < 3
            )
                return resHandler(
                    res,
                    400,
                    null,
                    'Campo "name" invalido nella richiesta!',
                    false
                );

            // Impostazione key
            data.name = name;
        }

        // Controllo userId
        if (userId || userId == null) {
            if (!mongoose.isValidObjectId(userId) && userId != null)
                return resHandler(
                    res,
                    400,
                    null,
                    'Campo "userId" invalido!',
                    false
                );
            data.userId = userId ? new mongoose.Types.ObjectId(userId) : null;
        }

        // Controllo activatedAt
        if (activatedAt) {
            const date = new Date(activatedAt);
            if (isNaN(date.getTime()))
                return resHandler(
                    res,
                    400,
                    null,
                    'Campo "activatedAt" invalido!',
                    false
                );
            // Impostazione activatedAt
            data.activatedAt = date;
        } else if (userId) {
            data.activatedAt = new Date();
        }

        // Controllo mode
        if (mode) {
            if (!['config', 'auto', 'safe'].includes(mode))
                return resHandler(
                    res,
                    400,
                    null,
                    'Campo "mode" invalido nella richiesta!',
                    false
                );

            // Impostazione mode
            data.mode = mode;
        }

        // Controllo dati
        if (Object.keys(data).length <= 0)
            return resHandler(
                res,
                400,
                null,
                'Nessun campo valido da aggiornare!',
                false
            );

        // Aggiornamento dispositivo database
        const device = await DeviceModel.findOneAndUpdate(
            { _id: deviceId },
            data,
            {
                new: true,
            }
        );

        // Controllo modifiche
        if (!device)
            return resHandler(
                res,
                500,
                null,
                'Modifiche non apportate correttamente!',
                false
            );

        // Risposta finale
        return resHandler(
            res,
            200,
            {
                id: device._id.toString(),
                key: device.key,
                name: device.name,
                prototypeModel: device.prototypeModel,
                userId: device.userId?.toString(),
                mode: device.mode,
                activatedAt: device.activatedAt,
                updatedAt: device.updatedAt,
                createdAt: device.createdAt,
            },
            'Dispositivo aggiornato con successo!',
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

// Gestore attivazione device
async function activateDevice(req: Request, res: Response): Promise<Response> {
    // Gestione errori
    try {
        // Ricavo dati richiesta
        const user: UserType | undefined = req.user;
        const { key }: { key?: string } = req.params;
        const { name }: { name?: string } = req.body;

        // Controllo utente
        if (!user)
            return resHandler(
                res,
                401,
                null,
                'Autenticazione non eseguita correttamente!',
                false
            );

        // Controllo nome
        if (!name || typeof name !== 'string')
            return resHandler(
                res,
                400,
                null,
                'Nome mancante o invalido!',
                false
            );

        // Ricavo dispositivo database
        const device = await DeviceModel.findOne({ key });

        // Controllo dispositivo
        if (!device || device?.userId)
            return resHandler(
                res,
                403,
                null,
                'Dispositivo inesistente, non disponibile o in utilizzo!',
                false
            );

        // Aggiornamento dispositivo database
        const deviceUpdate = await DeviceModel.findOneAndUpdate(
            { key },
            { userId: user.id, mode: 'config', activatedAt: new Date(), name },
            { new: true }
        );

        // Controllo modifiche
        if (!deviceUpdate)
            return resHandler(
                res,
                500,
                null,
                'Attivazione non apportata correttamente!',
                false
            );

        // Invio eventi ws
        emitToRoom(`DEVICE-${device._id.toString()}`, {
            event: 'activate',
            activate: true,
        });
        emitToRoom(`DEVICE-${device._id.toString()}`, {
            event: 'mode',
            mode: 'config',
        });

        // Risposta finale
        return resHandler(
            res,
            200,
            {
                id: deviceUpdate._id.toString(),
                key: deviceUpdate.key,
                name: deviceUpdate.name,
                prototypeModel: deviceUpdate.prototypeModel,
                userId: deviceUpdate.userId.toString(),
                mode: deviceUpdate.mode,
                activatedAt: deviceUpdate.activatedAt,
                updatedAt: deviceUpdate.updatedAt,
                createdAt: deviceUpdate.createdAt,
            },
            'Dispositivo attivato con successo!',
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

// Gestore modifica modalità
async function updateModeDevice(
    req: Request,
    res: Response
): Promise<Response> {
    // Gestione errori
    try {
        // Ricavo dati richiesta
        const user: UserType | undefined = req.user;
        const mode: string = req.body.mode;
        let {
            humMin,
            humMax,
            interval,
        }: {
            humMin?: string | number;
            humMax?: string | number;
            interval?: string | number;
        } = req.body;
        const id: string | undefined = req.params.id;

        // Controllo utente
        if (!user)
            return resHandler(
                res,
                401,
                null,
                'Autenticazione non eseguita correttamente!',
                false
            );

        // Controllo mode
        if (!mode || !['config', 'auto', 'safe'].includes(mode))
            return resHandler(
                res,
                400,
                null,
                'Campo "mode" invalido nella richiesta!',
                false
            );

        // Ricavo dispositivo database
        const device = await DeviceModel.findById(id);

        // Controllo dispositivo
        if (!device || device?.userId.toString() !== user.id)
            return resHandler(
                res,
                403,
                null,
                "Dispositivo inesistente o non appartenente all'utente autenticato!",
                false
            );

        // Controllo modalità
        if (
            mode == 'auto' &&
            Number(humMin) == 0 &&
            Number(humMax) == 0 &&
            Number(interval) == 0
        ) {
            // Ricavo dati database
            const data: DataType[] = await DataModel.find({
                deviceId: device._id,
                type: 'log_irrigation_config',
            });

            // Calcolo algoritmo
            const humMinResult = algorithmHumX(data, 0);
            const humMaxResult = algorithmHumX(data, 1);
            const intervalResult = algorithmInterval(data);

            // Controllo errore algoritmo humMin
            if (
                typeof humMinResult == 'object' &&
                humMinResult !== null &&
                'error' in humMinResult
            ) {
                return resHandler(
                    res,
                    humMinResult.error.status,
                    null,
                    humMinResult.error.message,
                    false
                );
            }

            // Controllo errore algoritmo humMax
            if (
                typeof humMaxResult == 'object' &&
                humMaxResult !== null &&
                'error' in humMaxResult
            ) {
                return resHandler(
                    res,
                    humMaxResult.error.status,
                    null,
                    humMaxResult.error.message,
                    false
                );
            }

            // Controllo errore algoritmo interval
            if (
                typeof intervalResult == 'object' &&
                intervalResult !== null &&
                'error' in intervalResult
            ) {
                return resHandler(
                    res,
                    intervalResult.error.status,
                    null,
                    intervalResult.error.message,
                    false
                );
            }

            humMin = humMinResult;
            humMax = humMaxResult;
            interval = intervalResult;
        }

        // Aggiornamento dispositivo database
        const deviceUpdate = await DeviceModel.findOneAndUpdate(
            { _id: id },
            { mode },
            { new: true }
        );

        // Aggiornamento impostazioni dispositivo database
        const deviceSettingsUpdate = await DeviceSettingsModel.findOneAndUpdate(
            { deviceId: id },
            { humMin, humMax, interval },
            { new: true }
        );

        // Controllo modifiche
        if (!deviceUpdate || !deviceSettingsUpdate)
            return resHandler(
                res,
                500,
                null,
                'Modifiche non apportate correttamente!',
                false
            );

        // Invio eventi ws
        emitToRoom(`DEVICE-${device._id.toString()}`, {
            event: 'mode',
            mode,
            info: {
                humMin: Number(humMin),
                humMax: Number(humMax),
                interval: Number(interval),
                updatedAt: deviceUpdate.updatedAt,
            },
        });

        // Risposta finale
        return resHandler(
            res,
            200,
            {
                id: deviceUpdate._id.toString(),
                key: deviceUpdate.key,
                name: deviceUpdate.name,
                prototypeModel: deviceUpdate.prototypeModel,
                userId: deviceUpdate.userId.toString(),
                mode: deviceUpdate.mode,
                activatedAt: deviceUpdate.activatedAt,
                updatedAt: deviceUpdate.updatedAt,
                createdAt: deviceUpdate.createdAt,
            },
            'Dispositivo attivato con successo!',
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

// Gestore delete devices
async function deleteDevice(req: Request, res: Response): Promise<Response> {
    // Gestione errori
    try {
        // Ricavo dati richiesta
        const user: UserType | undefined = req.user;
        let { id: deviceId }: { id?: string | mongoose.Types.ObjectId } =
            req.params;

        // Controllo utente
        if (!user)
            return resHandler(
                res,
                401,
                null,
                'Autenticazione non eseguita correttamente!',
                false
            );

        // Controllo ruolo utente
        if (user.role !== 'admin')
            return resHandler(
                res,
                403,
                null,
                "L'operazione di eliminazione di un dispositivo è riservata agli amministratori!",
                false
            );

        // Controllo id dispositivo
        if (!deviceId)
            return resHandler(
                res,
                400,
                null,
                'Id del dispositivo mancante!',
                false
            );

        // Controllo deviceId
        if (!mongoose.isValidObjectId(deviceId))
            return resHandler(res, 400, null, 'Campo "id" invalido!', false);

        // Parsing deviceId
        deviceId = new mongoose.Types.ObjectId(deviceId);

        // Eliminazione dispositivo database
        const device = await DeviceModel.findByIdAndDelete(deviceId);

        // Controllo modifiche
        if (!device)
            return resHandler(
                res,
                500,
                null,
                'Modifiche non apportate correttamente!',
                false
            );

        // Risposta finale
        return resHandler(
            res,
            200,
            {
                id: device._id.toString(),
                key: device.key,
                name: device.name,
                prototypeModel: device.prototypeModel,
                userId: device.userId?.toString(),
                mode: device.mode,
                activatedAt: device.activatedAt,
                updatedAt: device.updatedAt,
                createdAt: device.createdAt,
            },
            'Dispositivo eliminato con successo!',
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
export {
    getDevices,
    postDevice,
    patchDevice,
    deleteDevice,
    activateDevice,
    updateModeDevice,
};
