// Importazione moduli
import z from 'zod';
import { baseQuerySchema } from './Global.schema.js';
import { Types } from 'mongoose';
import sortParser from '../../global/utils/sortParser.js';

// Lista
const deviceVersionsSortFields = ['createdAt', 'updatedAt'];

// Schema query get /devices-versions/user
const GetDevicesVersionsUserQuerySchema = z
    .object({
        ...baseQuerySchema,
        deviceId: z.string().refine((val) => Types.ObjectId.isValid(val), {
            error: 'Invalid deviceId',
        }),
        sort: z
            .string()
            .optional()
            .transform((val) => (val ? sortParser(val) : []))
            .refine(
                (val) => {
                    return val.every((obj) =>
                        deviceVersionsSortFields.includes(obj.field),
                    );
                },
                {
                    error: 'Invalid sort field (should be "createdAt" or "updatedAt"',
                },
            ),
        channel: z.enum(['stable', 'beta', 'dev']).optional(),
    })
    .refine((val) => !val.from || !val.to || val.from <= val.to, {
        error: 'Invalid from/to range',
        path: ['from', 'to'],
    });

// Schema query get /devices-versions/:id
const GetDevicesVersionsParamsSchema = z.object({
    id: z.string().refine((val) => Types.ObjectId.isValid(val), {
        error: 'Invalid id',
    }),
});

// Schema query get /devices-versions/device
const GetDevicesVersionsDeviceQuerySchema = z.object({
    firmware: z.string(),
    channel: z.enum(['stable', 'beta', 'dev']),
});

// Schema body post /devices-versions
const PostDevicesVersionsBodySchema = z.object({
    notes: z.string().optional().nullable(),
    prototypeModel: z.string(),
    channel: z.enum(['stable', 'beta', 'dev']),
    mandatory: z.boolean(),
    code: z.string(),
    firmwareVersion: z.string(),
});

// Schema body post /devices-versions/install
const PostDevicesVersionsInstallBodySchema = z.object({
    firmwareVersion: z.string(),
    channel: z.enum(['stable', 'beta', 'dev']),
    deviceId: z.string().refine((val) => Types.ObjectId.isValid(val), {
        error: 'Invalid deviceId',
    }),
});

// Esportazione schemi
export {
    GetDevicesVersionsUserQuerySchema,
    GetDevicesVersionsParamsSchema,
    GetDevicesVersionsDeviceQuerySchema,
    PostDevicesVersionsBodySchema,
    PostDevicesVersionsInstallBodySchema,
};
