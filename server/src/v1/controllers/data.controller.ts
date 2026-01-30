// Importazione moduli
import type { Request, Response } from 'express';
import resHandler from '../../v1/utils/responseHandler.js';
import DataModel from '../models/Data.model.js';
import DeviceModel from '../models/Device.model.js';
import DeviceSettingsModel from '../models/DeviceSettings.model.js';
import mongoose, { type FilterQuery } from 'mongoose';
import type { DeviceType, UserType } from '../types/types.js';
import { emitToRoom } from '../../global/utils/wsRoomHandlers.js';
import { algorithmUpdateInterval } from '../../global/utils/irrigationAlgorithm.js';
import trimData from '../../global/utils/trimData.js';

// Gestore get data
async function getData(req: Request, res: Response): Promise<Response> {
    // Gestione errori
    try {
        // Ricavo dati richiesta
        const user: UserType | undefined = req.user;
        const {
            id,
            date,
            read,
            humI,
            humE,
            temp,
            lum,
            interval,
            deviceId,
            type,
            limit,
        }: {
            id?: string;
            date?: string;
            read?: string;
            humI?: string;
            humE?: string;
            temp?: string;
            lum?: string;
            interval?: string;
            deviceId?: string;
            type?: string;
            limit?: string;
        } = req.query;

        // Lista filtri
        const filter: {
            _id?: mongoose.Types.ObjectId;
            date?: Date;
            read?: boolean;
            humI?: number;
            humE?: number;
            temp?: number;
            lum?: number;
            interval?: number;
            type?: string;
            userId?: mongoose.Types.ObjectId;
            deviceId?: mongoose.Types.ObjectId;
            limit?: number;
        } = {};

        // Controllo utente
        if (!user)
            return resHandler(
                res,
                401,
                null,
                'Autenticazione non eseguita correttamente!',
                false,
            );

        // Controllo id
        if (id) {
            if (!mongoose.Types.ObjectId.isValid(id))
                return resHandler(
                    res,
                    400,
                    null,
                    'Campo "id" invalido nella richiesta!',
                    false,
                );

            // Impostazione id
            filter._id = new mongoose.Types.ObjectId(id);
        }

        // Controllo date
        if (date) {
            const parsedDate = new Date(date);
            if (isNaN(parsedDate.getTime()))
                return resHandler(
                    res,
                    400,
                    null,
                    'Campo "date" invalido!',
                    false,
                );
            // Impostazione date
            filter.date = parsedDate;
        }

        // Controllo read
        if (read !== undefined) {
            const parsedRead =
                read === 'true' ? true : read === 'false' ? false : null;
            if (parsedRead === null)
                return resHandler(
                    res,
                    400,
                    null,
                    'Campo "read" invalido nella richiesta!',
                    false,
                );

            // Impostazione read
            filter.read = parsedRead;
        }

        // Controllo humI
        if (humI) {
            if (isNaN(Number(humI)))
                return resHandler(
                    res,
                    400,
                    null,
                    'Campo "humI" invalido nella richiesta!',
                    false,
                );

            // Impostazione humI
            filter.humI = Number(humI);
        }

        // Controllo humE
        if (humE) {
            if (isNaN(Number(humE)))
                return resHandler(
                    res,
                    400,
                    null,
                    'Campo "humE" invalido nella richiesta!',
                    false,
                );

            // Impostazione humE
            filter.humE = Number(humE);
        }

        // Controllo temp
        if (temp) {
            if (isNaN(Number(temp)))
                return resHandler(
                    res,
                    400,
                    null,
                    'Campo "temp" invalido nella richiesta!',
                    false,
                );

            // Impostazione temp
            filter.temp = Number(temp);
        }

        // Controllo lum
        if (lum) {
            if (isNaN(Number(lum)))
                return resHandler(
                    res,
                    400,
                    null,
                    'Campo "lum" invalido nella richiesta!',
                    false,
                );

            // Impostazione lum
            filter.lum = Number(lum);
        }

        // Controllo interval
        if (interval) {
            if (isNaN(Number(interval)))
                return resHandler(
                    res,
                    400,
                    null,
                    'Campo "interval" invalido nella richiesta!',
                    false,
                );

            // Impostazione interval
            filter.interval = Number(interval);
        }

        // Controllo type
        if (type) {
            if (
                ![
                    'log_error',
                    'log_info',
                    'log_warning',
                    'log_irrigation_auto',
                    'log_irrigation_config',
                    'data_config',
                    'data_auto',
                ].includes(type)
            )
                return resHandler(
                    res,
                    400,
                    null,
                    'Campo "type" invalido nella richiesta!',
                    false,
                );

            // Impostazione type
            filter.type = type;
        }

        // Controllo deviceId
        if (deviceId) {
            if (!mongoose.isValidObjectId(deviceId))
                return resHandler(
                    res,
                    400,
                    null,
                    'Campo "deviceId" invalido nella richiesta!',
                    false,
                );

            // Impostazione deviceId
            filter.deviceId = new mongoose.Types.ObjectId(deviceId);
        }

        // Costruzione query
        const query = DataModel.find(filter).sort({ date: -1 });

        // Dichiarazione limite
        const parsedLimit = parseInt(limit || '-1');

        // Controllo limite
        if (limit && !isNaN(parsedLimit) && parsedLimit > 0)
            query.limit(parsedLimit);

        // Ricavo dati database
        let data = await query;

        // Ricavo dispositivo database
        const userDevices = await DeviceModel.find({ userId: user.id });

        // Lista id dispositivi
        const devicesId = userDevices.map((userDevice) => userDevice._id);

        // Controllo deviceId
        data = data.filter((dato) => {
            return devicesId.some(
                (id) => id.toString() === dato.deviceId.toString(),
            );
        });

        // Risposta finale
        return resHandler(
            res,
            200,
            data.map((dato) => {
                return {
                    id: dato._id.toString(),
                    desc: dato.desc,
                    link: dato.link,
                    read: dato.read,
                    date: dato.date,
                    humI: dato.humI,
                    humE: dato.humE,
                    temp: dato.temp,
                    lum: dato.lum,
                    interval: dato.interval,
                    deviceId: dato.deviceId.toString(),
                    type: dato.type,
                    updatedAt: dato.updatedAt,
                    createdAt: dato.createdAt,
                };
            }),
            'Dati ricavati con successo!',
            true,
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

// Gestore post data
async function postData(req: Request, res: Response): Promise<Response> {
    // Gestione errori
    try {
        // Ricavo dati richiesta
        const device: DeviceType | undefined = req.device;
        const {
            desc,
            link,
            date,
            read,
            humI,
            humE,
            temp,
            lum,
            interval,
            type,
        }: {
            desc?: string;
            link?: string;
            date?: string;
            read?: boolean;
            humI?: string | [string, string];
            humE?: string;
            temp?: string;
            lum?: string;
            interval?: string;
            type?: string;
        } = req.body;

        // Lista filtri
        const data: {
            _id?: mongoose.Types.ObjectId;
            desc?: string;
            link?: string;
            date?: Date;
            read?: boolean;
            humI?: number | [number, number];
            humE?: number;
            temp?: number;
            lum?: number;
            interval?: number;
            type?: string;
            userId?: mongoose.Types.ObjectId;
            deviceId?: mongoose.Types.ObjectId;
            limit?: number;
        } = {};

        // Controllo utente
        if (!device)
            return resHandler(
                res,
                401,
                null,
                'Autenticazione non eseguita correttamente!',
                false,
            );

        // Controllo desc
        if (desc) {
            if (desc.length > 255 || typeof desc !== 'string')
                return resHandler(
                    res,
                    400,
                    null,
                    'Campo "desc" invalido nella richiesta!',
                    false,
                );

            // Impostazione desc
            data.desc = desc;
        }

        // Controllo link
        if (link) {
            if (
                link.length <= 0 ||
                link.length > 255 ||
                typeof link !== 'string'
            )
                return resHandler(
                    res,
                    400,
                    null,
                    'Campo "link" invalido nella richiesta!',
                    false,
                );

            // Impostazione link
            data.link = link;
        }

        // Controllo date
        if (date) {
            const parsedDate = new Date(date);
            if (isNaN(parsedDate.getTime()))
                return resHandler(
                    res,
                    400,
                    null,
                    'Campo "date" invalido!',
                    false,
                );
            // Impostazione date
            data.date = parsedDate;
        }

        // Controllo read
        if (read !== undefined) {
            if (typeof read !== 'boolean')
                return resHandler(
                    res,
                    400,
                    null,
                    'Campo "read" invalido nella richiesta!',
                    false,
                );

            // Impostazione read
            data.read = read;
        }

        // Controllo humI
        if (humI !== undefined) {
            if (Array.isArray(humI)) {
                if (humI.length !== 2 || humI.some((n) => isNaN(Number(n))))
                    return resHandler(
                        res,
                        400,
                        null,
                        'Campo "humI" invalido nella richiesta!',
                        false,
                    );

                // Impostazione humI
                data.humI = [Number(humI[0]), Number(humI[1])] as [
                    number,
                    number,
                ];
            } else {
                if (typeof humI !== 'number' || isNaN(humI))
                    return resHandler(
                        res,
                        400,
                        null,
                        'Campo "humI" invalido nella richiesta!',
                        false,
                    );

                // Impostazione humI
                data.humI = Number(humI);
            }
        }

        // Controllo humE
        if (humE) {
            if (isNaN(Number(humE)))
                return resHandler(
                    res,
                    400,
                    null,
                    'Campo "humE" invalido nella richiesta!',
                    false,
                );

            // Impostazione humE
            data.humE = Number(humE);
        }

        // Controllo temp
        if (temp) {
            if (isNaN(Number(temp)))
                return resHandler(
                    res,
                    400,
                    null,
                    'Campo "temp" invalido nella richiesta!',
                    false,
                );

            // Impostazione temp
            data.temp = Number(temp);
        }

        // Controllo lum
        if (lum) {
            if (isNaN(Number(lum)))
                return resHandler(
                    res,
                    400,
                    null,
                    'Campo "lum" invalido nella richiesta!',
                    false,
                );

            // Impostazione lum
            data.lum = Number(lum);
        }

        // Controllo interval
        if (interval) {
            if (isNaN(Number(interval)))
                return resHandler(
                    res,
                    400,
                    null,
                    'Campo "interval" invalido nella richiesta!',
                    false,
                );

            // Impostazione interval
            data.interval = Number(interval);
        }

        // Controllo type
        if (type) {
            if (
                ![
                    'log_error',
                    'log_info',
                    'log_warning',
                    'log_irrigation_auto',
                    'log_irrigation_config',
                    'data_config',
                    'data_auto',
                ].includes(type)
            )
                return resHandler(
                    res,
                    400,
                    null,
                    'Campo "type" invalido nella richiesta!',
                    false,
                );

            // Impostazione type
            data.type = type;
        }

        // Impostazione deviceId
        data.deviceId = new mongoose.Types.ObjectId(device.id);

        // Creazione dati database
        const dato = new DataModel(data);
        // Salvataggio dati
        await dato.save();

        // Controllo tipo
        if (data.type == 'log_irrigation_auto' && Array.isArray(data.humI)) {
            // Ricavo impostazioni dispositivo database
            const settings = await DeviceSettingsModel.findOne({
                deviceId: device.id,
            });

            // Controllo impostazioni
            if (!settings)
                return resHandler(
                    res,
                    404,
                    null,
                    'Impostazioni dispositivo inesistenti!',
                    false,
                );

            // Calcolo nuovo intervallo
            const newInterval = algorithmUpdateInterval(
                data.humI[0],
                data.humI[1],
                settings.humMax,
                settings.interval,
            );

            // Controllo nuovo intervallo
            if (newInterval !== null) {
                // Aggiornamento impostazioni dispositivo database
                const settingsUpdate =
                    await DeviceSettingsModel.findOneAndUpdate(
                        { deviceId: data.deviceId },
                        { interval: newInterval },
                        { new: true },
                    );

                // Controllo modifiche
                if (!settingsUpdate)
                    return resHandler(
                        res,
                        500,
                        null,
                        'Modifica impostazioni non apportata correttamente!',
                        false,
                    );

                // Invio eventi ws
                emitToRoom(`DEVICE-${device.id}`, {
                    event: 'mode',
                    mode: 'auto',
                    info: {
                        humMin: settingsUpdate.humMin,
                        humMax: settingsUpdate.humMax,
                        interval: settingsUpdate.interval,
                        updatedAt: settingsUpdate.updatedAt,
                    },
                });
            }
        }

        // Eliminazione dati
        await Promise.all([
            trimData(device.id, 'log_info', 10),
            trimData(device.id, 'log_error', 10),
            trimData(device.id, 'log_warning', 10),
            trimData(device.id, 'data_auto', 20),
            trimData(device.id, 'data_config', 20),
            trimData(device.id, 'log_irrigation_auto'),
            trimData(device.id, 'log_irrigation_config'),
        ]);

        // Dato risposta
        const returnData = {
            id: dato._id.toString(),
            desc: dato.desc,
            link: dato.link,
            read: dato.read,
            date: dato.date,
            humI: dato.humI,
            humE: dato.humE,
            temp: dato.temp,
            lum: dato.lum,
            interval: dato.interval,
            deviceId: dato.deviceId.toString(),
            type: dato.type,
            updatedAt: dato.updatedAt,
            createdAt: dato.createdAt,
        };

        if (data.type == 'data_auto' || data.type == 'data_config')
            emitToRoom(`USER-${device.userId}`, {
                event: 'data',
                data: returnData,
            });

        // Risposta finale
        return resHandler(
            res,
            200,
            returnData,
            'Dati creati con successo!',
            true,
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

// Gestore patch data
async function patchData(req: Request, res: Response): Promise<Response> {
    // Gestione errori
    try {
        // Ricavo dati richiesta
        const user: UserType | undefined = req.user;
        const { read }: { read?: boolean } = req.body;
        let { id: dataId }: { id?: string | mongoose.Types.ObjectId } =
            req.params;

        // Controllo utente
        if (!user)
            return resHandler(
                res,
                401,
                null,
                'Autenticazione non eseguita correttamente!',
                false,
            );

        // Controllo read
        if (typeof read !== 'boolean')
            return resHandler(
                res,
                400,
                null,
                'Campo "read" invalido nella richiesta!',
                false,
            );

        // Controllo id dati
        if (!dataId)
            return resHandler(res, 400, null, 'Id dei dati mancante!', false);

        // Controllo dataId
        if (!mongoose.isValidObjectId(dataId))
            return resHandler(res, 400, null, 'Campo "id" invalido!', false);

        // Parsing dataId
        dataId = new mongoose.Types.ObjectId(dataId);

        // Ricavo dispositivo database
        const userDevices = await DeviceModel.find({ userId: user.id });

        // Lista id dispositivi
        const devicesId = userDevices.map((userDevice) => userDevice._id);

        // Ricavo dati database
        const checkDato = await DataModel.findById(dataId);

        if (!checkDato)
            return resHandler(
                res,
                404,
                null,
                'Il dato non è esistente!',
                false,
            );

        // Controllo dataId
        if (
            !devicesId
                .map((d) => d.toString())
                .includes(checkDato.deviceId.toString())
        )
            return resHandler(
                res,
                403,
                null,
                "Il dispositivo da cui proviene il dato non appartiene all'account autenticato!",
                false,
            );

        // Aggiornamento dati database
        const dato = await DataModel.findByIdAndUpdate(
            dataId,
            { read },
            { new: true },
        );

        // Controllo modifiche
        if (!dato)
            return resHandler(
                res,
                500,
                null,
                'Modifiche non apportate correttamente!',
                false,
            );

        // Risposta finale
        return resHandler(
            res,
            200,
            {
                id: dato._id.toString(),
                desc: dato.desc,
                link: dato.link,
                read: dato.read,
                date: dato.date,
                humI: dato.humI,
                humE: dato.humE,
                temp: dato.temp,
                lum: dato.lum,
                interval: dato.interval,
                deviceId: dato.deviceId.toString(),
                type: dato.type,
                updatedAt: dato.updatedAt,
                createdAt: dato.createdAt,
            },
            'Dati modificati con successo!',
            true,
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

// Gestore delete data
async function deleteData(req: Request, res: Response): Promise<Response> {
    // Gestione errori
    try {
        // Ricavo dati richiesta
        const user: UserType | undefined = req.user;
        const {
            id,
            date,
            read,
            deviceId,
            type,
        }: {
            id?: string;
            date?: string;
            read?: string;
            deviceId?: string;
            type?: string;
        } = req.query;

        // Lista filtri
        const filter: FilterQuery<typeof DataModel> = {};

        // Controllo utente
        if (!user)
            return resHandler(
                res,
                401,
                null,
                'Autenticazione non eseguita correttamente!',
                false,
            );

        // Controllo id
        if (id) {
            if (!mongoose.Types.ObjectId.isValid(id))
                return resHandler(
                    res,
                    400,
                    null,
                    'Campo "id" invalido nella richiesta!',
                    false,
                );

            // Impostazione id
            filter._id = new mongoose.Types.ObjectId(id);
        }

        // Controllo date
        if (date) {
            const parsedDate = new Date(date);
            if (isNaN(parsedDate.getTime()))
                return resHandler(
                    res,
                    400,
                    null,
                    'Campo "date" invalido!',
                    false,
                );
            // Impostazione date
            filter.date = parsedDate;
        }

        // Controllo read
        if (read !== undefined) {
            const parsedRead =
                read === 'true' ? true : read === 'false' ? false : null;
            if (parsedRead === null)
                return resHandler(
                    res,
                    400,
                    null,
                    'Campo "read" invalido nella richiesta!',
                    false,
                );

            // Impostazione read
            filter.read = parsedRead;
        }

        // Controllo type
        if (type) {
            if (
                ![
                    'log_error',
                    'log_info',
                    'log_warning',
                    'log_irrigation_auto',
                    'log_irrigation_config',
                    'data_config',
                    'data_auto',
                ].includes(type)
            )
                return resHandler(
                    res,
                    400,
                    null,
                    'Campo "type" invalido nella richiesta!',
                    false,
                );

            // Impostazione type
            filter.type = type;
        }

        // Controllo deviceId
        if (deviceId) {
            if (!mongoose.isValidObjectId(deviceId))
                return resHandler(
                    res,
                    400,
                    null,
                    'Campo "deviceId" invalido nella richiesta!',
                    false,
                );

            // Impostazione deviceId
            filter.deviceId = new mongoose.Types.ObjectId(deviceId);
        }

        // Ricavo dispositivi database
        const userDevices = await DeviceModel.find({ userId: user.id });

        // Lista id dispositivi
        const devicesId = userDevices.map((userDevice) => userDevice._id);

        // Controllo id dispositivo
        if (!deviceId) {
            filter.deviceId = { $in: devicesId };
        }

        // Ricavo dati database
        await DataModel.deleteMany(filter);

        // Risposta finale
        return resHandler(res, 200, null, 'Dati eliminati con successo!', true);
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
export { getData, postData, patchData, deleteData };
