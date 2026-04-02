// Importazione moduli
import { type FilterQuery } from 'mongoose';
import DeviceVersionsModel, {
    type DevicesVersionsType,
} from '../models/DevicesVersions.model.js';
import { readFile, writeFile, mkdir } from 'fs/promises';
import { dirname, join } from 'path';
import { cwd } from 'process';
import type { BaseManyRequest, IdType } from '../types/types.js';

// Respository versioni dispositivi
class DeviceVersionsRepository {
    // Funzione ricevi versioni dispositivi
    async findMany(
        payload: BaseManyRequest & {
            channel?: 'stable' | 'beta' | 'dev';
            prototypeModel?: string;
            mandatory?: boolean;
            firmwareVersion?: string;
        },
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
        prototypeModel: string;
        channel: 'stable' | 'beta' | 'dev';
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
    async findOneById(id: IdType) {
        // Richiesta versione dispositivo database
        const deviceVersion = await DeviceVersionsModel.findById(id).lean();

        // Ritorno versione dispositivo
        return deviceVersion;
    }

    // Funzione creazione versioni dispositivo
    async createOne(payload: {
        notes?: string | null;
        prototypeModel: string;
        channel: 'stable' | 'beta' | 'dev';
        mandatory: boolean;
        filepath: string;
        firmwareVersion: string;
    }) {
        // Creazione versione dispositivo
        const deviceVersion = new DeviceVersionsModel(payload);

        // Salvataggio versione dispositivo
        await deviceVersion.save();

        // Ritorno versione dispositivo
        return deviceVersion.toObject();
    }

    // Funzione creazione path versioni dispositivo
    async createFilepath(payload: {
        prototypeModel: string;
        channel: 'stable' | 'beta' | 'dev';
        firmwareVersion: string;
    }) {
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

        // Ritono filepath
        return filepath;
    }

    // Funzione salvataggio versioni dispositivo
    async save(filepath: string, payload: { code: string }) {
        // Creazione directory
        await mkdir(dirname(filepath), { recursive: true });

        // Creazione file
        await writeFile(filepath, payload.code);

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
