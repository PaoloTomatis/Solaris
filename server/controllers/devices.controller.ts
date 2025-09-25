// Importazione moduli
import type { Request, Response } from 'express';
import resHandler from '../utils/responseHandler.js';
import DeviceModel from '../models/Device.model.js';
import mongoose from 'mongoose';
import { v4 as uuid } from 'uuid';
import type { UserType } from '../types/types.js';

// Gestore get devices
async function getDevices(req: Request, res: Response): Promise<Response> {
    // Gestione errori
    try {
        // Ricavo dati richiesta
        const user: UserType | undefined = req.body.user;
        const {
            id,
            key,
            name,
            prototype,
            activatedAt,
            mode,
            limit,
        }: {
            id?: string;
            key?: string;
            name?: string;
            prototype?: string;
            activatedAt?: string;
            mode?: 'config' | 'auto' | 'safe';
            limit?: string;
        } = req.query;

        // Lista filtri
        const filter: {
            _id?: mongoose.Types.ObjectId;
            key?: string;
            name?: string;
            prototype?: string;
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

        // Controllo prototype
        if (prototype) {
            if (typeof prototype !== 'string')
                return resHandler(
                    res,
                    400,
                    null,
                    'Campo "prototype" invalido nella richiesta!',
                    false
                );

            // Impostazione prototype
            filter.prototype = prototype;
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
        filter.userId = user.id;

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
                    prototype: device.prototype,
                    userId: device.userId.toString(),
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
        const user: UserType | undefined = req.body.user;
        const {
            key,
            name,
            prototype,
            activatedAt,
            mode,
        }: {
            key?: string;
            name?: string;
            prototype?: string;
            activatedAt?: string;
            mode?: 'config' | 'auto' | 'safe';
        } = req.query;

        // Lista filtri
        const data: {
            key?: string;
            name?: string;
            prototype?: string;
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

        // Controllo prototype
        if (prototype) {
            if (typeof prototype !== 'string')
                return resHandler(
                    res,
                    400,
                    null,
                    'Campo "prototype" invalido nella richiesta!',
                    false
                );

            // Impostazione prototype
            data.prototype = prototype;
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

        // Creazione dispositivo database
        const device = new DeviceModel();
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

        // Risposta finale
        return resHandler(
            res,
            201,
            {
                id: device._id.toString(),
                key: device.key,
                name: device.name,
                prototype: device.prototype,
                userId: device.userId.toString(),
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
        const user: UserType | undefined = req.body.user;
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
        let { id: deviceId }: { id?: string | mongoose.Types.ObjectId } =
            req.params;

        // Lista modifiche
        const data: {
            name?: string;
            activatedAt?: Date;
            mode?: 'config' | 'auto' | 'safe';
            userId?: mongoose.Types.ObjectId;
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
        if (userId) {
            if (!mongoose.isValidObjectId(userId))
                return resHandler(
                    res,
                    400,
                    null,
                    'Campo "userId" invalido!',
                    false
                );
            data.userId = new mongoose.Types.ObjectId(userId);
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
        const device = await DeviceModel.findByIdAndUpdate(deviceId, data, {
            new: true,
        });

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
                prototype: device.prototype,
                userId: device.userId.toString(),
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

// Gestore delete devices
async function deleteDevice(req: Request, res: Response): Promise<Response> {
    // Gestione errori
    try {
        // Ricavo dati richiesta
        const user: UserType | undefined = req.body.user;
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
                prototype: device.prototype,
                userId: device.userId.toString(),
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
export { getDevices, postDevice, patchDevice, deleteDevice };
