// Importazione moduli
import z from 'zod';
import { Types } from 'mongoose';
import { baseQuerySchema } from './Global.schema.js';
import sortParser from '../../global/utils/sortParser.js';

// Schema params get /devices/:deviceId
const GetDeviceParamsSchema = z.object({
    deviceId: z.string().refine((val) => Types.ObjectId.isValid(val), {
        error: 'Invalid deviceId',
        path: ['deviceId'],
    }),
});

// Lista campi consentiti
const devicesSortFields = ['createdAt', 'updatedAt', 'activatedAt'];

// Schema query get /irrigations
const GetDevicesQuerySchema = z
    .object({
        ...baseQuerySchema,
        deviceId: z
            .string()
            .optional()
            .refine((val) => !val || Types.ObjectId.isValid(val), {
                error: 'Invalid deviceId',
            }),
        sort: z
            .string()
            .optional()
            .transform((val) => (val ? sortParser(val) : []))
            .refine(
                (val) => {
                    return val.every((obj) =>
                        devicesSortFields.includes(obj.field),
                    );
                },
                {
                    error: 'Invalid sort field (should be "createdAt", "updatedAt" or "activatedAt")',
                },
            ),
    })
    .refine((val) => !val.from || !val.to || val.from <= val.to, {
        error: 'Invalid from/to range',
        path: ['from', 'to'],
    });

// Schema body post /devices
const PostDevicesBodySchema = z.object({
    key: z.string().min(10).optional(),
    name: z.string().min(3).max(15).optional().default('My Device'),
    psw: z
        .string()
        .regex(/^(?=.*\d)(?=.*[^a-zA-Z0-9]).{8,255}$/)
        .optional(),
    prototypeModel: z.string(),
});

// Schema params patch /devices/activate/:key
const PatchDeviceActivateParamsSchema = z.object({
    key: z.string(),
});

// Schema body patch /devices/:deviceId
const PatchDevicesBodySchema = z.object({
    name: z.string().min(3).max(15),
});

// Schema body patch /devices/activate/:deviceId
const PatchDevicesActivateBodySchema = PatchDevicesBodySchema;

// Schema params patch /devices/:deviceId
const PatchDevicesParamsSchema = GetDeviceParamsSchema;

// Schema params delete /devices/:id
const DeleteDevicesParamsSchema = GetDeviceParamsSchema;

// Esportazione schemi
export {
    GetDeviceParamsSchema,
    GetDevicesQuerySchema,
    PostDevicesBodySchema,
    PatchDevicesActivateBodySchema,
    PatchDeviceActivateParamsSchema,
    PatchDevicesBodySchema,
    PatchDevicesParamsSchema,
    DeleteDevicesParamsSchema,
};
