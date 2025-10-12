// Importazione moduli
import type { Request, Response } from 'express';
import resHandler from '../utils/responseHandler.js';
import DeviceModel from '../models/Device.model.js';
import mongoose from 'mongoose';
import { v4 as uuid } from 'uuid';
import type { UserType } from '../types/types.js';
import bcrypt from 'bcrypt';
import pswGenerator from '../utils/pswGenerator.js';
import DataModel from '../models/Data.model.js';
import { emitToRoom } from '../utils/wsRoomHandlers.js';

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
            psw,
            name,
            prototype,
            activatedAt,
            mode,
        }: {
            key?: string;
            psw?: string;
            name?: string;
            prototype?: string;
            activatedAt?: string;
            mode?: 'config' | 'auto' | 'safe';
        } = req.query;

        // Lista filtri
        const data: {
            key?: string;
            psw?: string;
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

        // Controllo psw
        if (psw) {
            if (psw.length < 8 || psw.length > 255)
                return resHandler(
                    res,
                    400,
                    null,
                    'Campo "psw" invalido nella richiesta!',
                    false
                );

            // Hash password
            const hashedPsw = await bcrypt.hash(psw, 10);

            // Impostazione psw
            data.psw = hashedPsw;
        } else {
            data.psw = pswGenerator();
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
        const { key }: { key?: string } = req.params;

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
        if (!key || typeof key !== 'string')
            return resHandler(
                res,
                400,
                null,
                'Chiave del dispositivo mancante o invalida!',
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
        const device = await DeviceModel.findOneAndUpdate({ key }, data, {
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

// Gestore attivazione device
async function activateDevice(req: Request, res: Response): Promise<Response> {
    // Gestione errori
    try {
        // Ricavo dati richiesta
        const user: UserType | undefined = req.body.user;
        const { key }: { key?: string } = req.params;

        // Controllo utente
        if (!user)
            return resHandler(
                res,
                401,
                null,
                'Autenticazione non eseguita correttamente!',
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
            { userId: user.id, mode: 'config', activatedAt: new Date() },
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
                prototype: deviceUpdate.prototype,
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
        const user: UserType | undefined = req.body.user;
        const mode: string | undefined = req.body.mode;
        const key: string | undefined = req.params.key;

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
        const device = await DeviceModel.findOne({ key });

        // Controllo dispositivo
        if (!device || device?.userId.toString() !== user.id)
            return resHandler(
                res,
                403,
                null,
                "Dispositivo inesistente o non appartenente all'utente autenticato!",
                false
            );

        //TODO - Calcolo MODALITA'

        // Calcolo humMin e humMax
        // Ricavo dati database
        const dataDB = await DataModel.find({ type: 'data_config' });

        // Controllo dati
        if (!dataDB || dataDB?.length < 10)
            return resHandler(
                res,
                404,
                null,
                'I dati delle irrigazioni sono mancanti o minori di 10!',
                false
            );

        // Sort dei dati per humI1
        const sortedData1 = dataDB
            .sort((a, b) => {
                return Array.isArray(a.humI) && Array.isArray(b.humI)
                    ? a.humI[0] - b.humI[0]
                    : 0;
            })
            .map((data) => (Array.isArray(data.humI) ? data.humI[0] : null));

        // Dichiarazione lista dati per humI1
        const data1: ({ humI: number; peso: number } | undefined)[] = [];

        // Dichiarazione posizione centrale per humI1
        const posC1: number | [number, number] =
            sortedData1.length % 2 == 0
                ? [sortedData1.length / 2 + 0.5, sortedData1.length / 2 - 0.5]
                : sortedData1.length / 2;

        // Dichiarazione media
        let media1 = 0;

        sortedData1.forEach((data): Response | void => {
            // Dichiarazione peso
            let peso: number;

            // Controllo dato
            if (data) {
                // Controllo posC1
                if (Array.isArray(posC1)) {
                    // Calcolo pesi
                    const pesoM1 =
                        sortedData1.length / 2 +
                        Math.abs(posC1[1] - sortedData1.indexOf(data));
                    const pesoM2 =
                        sortedData1.length / 2 +
                        Math.abs(posC1[0] - sortedData1.indexOf(data));

                    // Assegnazione peso
                    peso = pesoM1 < pesoM2 ? pesoM1 : pesoM2;
                } else if (!isNaN(posC1)) {
                    // Assegnazione peso
                    peso =
                        sortedData1.length / 2 +
                        0.5 +
                        Math.abs(posC1 - sortedData1.indexOf(data));
                } else {
                    return resHandler(
                        res,
                        500,
                        null,
                        "Errore nel calcolo dei pesi per l'algoritmo di humMax e humMin!",
                        false
                    );
                }

                data1.push({
                    humI: data,
                    peso,
                });
            }
        });

        // Calcolo media
        data1.forEach((data) => {
            // Somma alla media
            media1 += data ? data.humI * data.peso : 0;
        });
        const humMin =
            sortedData1.length % 2 == 0
                ? media1 /
                  ((sortedData1.length / 2) * (sortedData1.length / 2 + 1))
                : (media1 / (data1.length / 2)) ** 2;

        // Calcolo kInterval
        // Dichiarazione medie
        let mediaInt1 = 0;
        let mediaInt2 = 0;
        let valsInt1 = 0;
        let valsInt2 = 0;

        // Calcolo medie
        dataDB.forEach((data) => {
            // Controllo interval
            if (data.interval) {
                // Somma alla media 1
                mediaInt1 += data.interval;
                // Somma valori 1
                valsInt1 += 1;
            }
            // Controllo humI
            if (Array.isArray(data.humI)) {
                // Somma alla media 2
                mediaInt2 += data.humI[1] - data.humI[0];
                // Somma valori 2
                valsInt2 += 1;
            }
        });
        mediaInt1 = mediaInt1 / valsInt1;
        mediaInt2 = mediaInt2 / valsInt2;
        const interval = mediaInt1 / mediaInt2;

        //TODO - Salvo IMPOSTAZIONI DISPOSITIVO

        // Aggiornamento dispositivo database
        const deviceUpdate = await DeviceModel.findOneAndUpdate(
            { key },
            { mode, humMin, interval },
            { new: true }
        );

        // Controllo modifiche
        if (!deviceUpdate)
            return resHandler(
                res,
                500,
                null,
                'Modifica non apportata correttamente!',
                false
            );

        //TODO - Invio DATI delle IMPOSTAZIONI DISPOSITIVO

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
                prototype: deviceUpdate.prototype,
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
export {
    getDevices,
    postDevice,
    patchDevice,
    deleteDevice,
    activateDevice,
    updateModeDevice,
};
