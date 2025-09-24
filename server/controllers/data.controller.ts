// Importazione moduli
import type { Request, Response } from 'express';
import resHandler from '../utils/responseHandler.js';
import DataModel from '../models/Data.model.js';
import DeviceModel from '../models/Device.model.js';
import mongoose from 'mongoose';

// Gestore get devices
async function getData(req: Request, res: Response): Promise<Response> {
    // Gestione errori
    try {
        // Ricavo dati richiesta
        const user: { id: mongoose.Types.ObjectId; email: string } | undefined =
            req.body.user;
        const {
            id,
            date,
            read,
            humI,
            humE,
            temp,
            lum,
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
            deviceId?: string;
            type?:
                | 'log_error'
                | 'log_info'
                | 'log_warning'
                | 'log_irrigation_auto'
                | 'log_irrigation_config'
                | 'data_config'
                | 'data_auto';
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
            type?:
                | 'log_error'
                | 'log_info'
                | 'log_warning'
                | 'log_irrigation_auto'
                | 'log_irrigation_config'
                | 'data_config'
                | 'data_auto';
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

        // Controllo date
        if (date) {
            const parsedDate = new Date(date);
            if (isNaN(parsedDate.getTime()))
                return resHandler(
                    res,
                    400,
                    null,
                    'Campo "date" invalido!',
                    false
                );
            // Impostazione date
            filter.date = parsedDate;
        }

        // Controllo read
        if (read) {
            const parsedRead =
                read === 'true' ? true : read === 'false' ? false : null;
            if (parsedRead === null)
                return resHandler(
                    res,
                    400,
                    null,
                    'Campo "read" invalido nella richiesta!',
                    false
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
                    false
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
                    false
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
                    false
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
                    false
                );

            // Impostazione lum
            filter.lum = Number(lum);
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
                    false
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
                    false
                );

            // Impostazione deviceId
            filter.deviceId = new mongoose.Types.ObjectId(deviceId);
        }

        // Costruzione query
        const query = DataModel.find(filter);

        // Controllo limite
        if (limit && parseInt(limit) > 0) query.limit(parseInt(limit));

        // Ricavo dati database
        let data = await query;

        // Ricavo dispositivo database
        const userDevices = await DeviceModel.find({ userId: user.id });

        // Lista id dispositivi
        const devicesId = userDevices.map((userDevice) => userDevice._id);

        // Controllo deviceId
        data = data.filter((dato) =>
            devicesId.some((id) => id === dato.deviceId)
        );

        // Risposta finale
        return resHandler(
            res,
            200,
            data.map((dato) => {
                return {
                    id: dato._id,
                    desc: dato.desc,
                    link: dato.link,
                    read: dato.read,
                    date: dato.date,
                    humI: dato.humI,
                    humE: dato.humE,
                    temp: dato.temp,
                    lum: dato.lum,
                    deviceId: dato.deviceId,
                    type: dato.type,
                    updatedAt: dato.updatedAt,
                    createdAt: dato.createdAt,
                };
            }),
            'Dati ricavati con successo!',
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
export { getData };
