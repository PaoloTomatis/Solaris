// Importazione moduli
import { Types, type FilterQuery } from 'mongoose';
import DeviceVersionsModel, {
    type DevicesVersionsType,
} from '../models/DeviceVersions.model.js';
import {
    GetDevicesVersionsUserQuerySchema,
    PostDevicesVersionsBodySchema,
} from '../schemas/DevicesVersions.schema.js';
import z from 'zod';
import { readFile, writeFile, mkdir } from 'fs/promises';
import { dirname, join } from 'path';
import { cwd } from 'process';

// Respository versioni dispositivi
class DeviceVersionsRepository {
    // Funzione ricevi versioni dispositivi
    async findMany(
        payload: Omit<
            z.infer<typeof GetDevicesVersionsUserQuerySchema> & {
                firmwareVersion?: string;
                prototypeModel?: string;
            },
            'deviceId'
        >,
    ) {
        // Dichiarazione filtri
        const filter: FilterQuery<DevicesVersionsType> = {};

        // Controllo from/to
        if (payload.from || payload.to) {
            filter.createdAt = {};
            if (payload.from) filter.createdAt.$gte = payload.from;
            if (payload.to) filter.createdAt.$lte = payload.to;
        }

        // Controllo channel
        if (payload.channel) filter.channel = payload.channel;

        // Controllo versione firmware
        if (payload.firmwareVersion)
            filter.firmwareVersion = payload.firmwareVersion;

        // Controllo modello prototipo
        if (payload.prototypeModel)
            filter.prototypeModel = payload.prototypeModel;

        // Richiesta versioni dispositivi database
        const query = DeviceVersionsModel.find(filter).lean();

        // Controllo lunghezza sort
        if (payload.sort?.length) {
            const sortObj: Record<string, 1 | -1> = {};
            for (const s of payload.sort) {
                sortObj[s.field] = s.order === 'asc' ? 1 : -1;
            }
            query.sort(sortObj);
        }

        // Impostazione limite
        query.limit(payload.limit);

        // Esecuzione query
        const devicesVersions = await query;

        // Ritorno versioni dispositivi
        return devicesVersions;
    }

    // Funzione ricevi versione dispositivo
    async findLatest(payload: {
        firmwareVersion?: string;
        prototypeModel?: string;
        channel?: 'stable' | 'beta' | 'dev';
        mandatory?: boolean;
    }) {
        // Richiesta versione dispositivo database
        const query = DeviceVersionsModel.findOne(payload).lean();

        // Definizione sort
        query.sort({ ['createdAt']: 'desc' });

        // Esecuzione query
        const deviceVersion = await query;

        // Ritorno versione dispositivo
        return deviceVersion;
    }

    // Funzione ricevi versione dispositivo
    async findOne(id: string | Types.ObjectId) {
        // Richiesta versione dispositivo database
        const deviceVersion = await DeviceVersionsModel.findById(id).lean();

        // Ritorno versione dispositivo
        return deviceVersion;
    }

    // Funzione creazione versioni dispositivo
    async createOne(
        payload: Omit<z.infer<typeof PostDevicesVersionsBodySchema>, 'code'> & {
            filepath: string;
        },
    ) {
        // Creazione versione dispositivo
        const deviceVersion = new DeviceVersionsModel(payload);

        // Salvataggio versione dispositivo
        await deviceVersion.save();

        // Ritorno versione dispositivo
        return deviceVersion.toObject();
    }

    // Funzione salvataggio versioni dispositivo
    async save(
        payload: {
            prototypeModel: string;
            channel: 'stable' | 'beta' | 'dev';
            firmwareVersion: string;
        },
        code: string,
    ) {
        // Definizione directory
        const filepath = join(
            cwd(),
            'firmwares',
            payload.prototypeModel.toLowerCase(),
            payload.channel.toLocaleLowerCase(),
            `${payload.firmwareVersion}.py`,
        );

        // Creazione directory
        await mkdir(dirname(filepath), { recursive: true });

        // Creazione file
        await writeFile(filepath, code);

        // Ritono filepath
        return filepath;
    }

    // Funzione lettura versioni dispositivo
    async read(filepath: string) {
        // Lettura codice
        return await readFile(filepath);
    }
}

// Esportazione repository
export default new DeviceVersionsRepository();
