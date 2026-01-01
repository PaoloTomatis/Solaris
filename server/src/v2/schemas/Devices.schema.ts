// Importazione moduli
import z from 'zod';
import { Types } from 'mongoose';

// Schema params get /devices/:deviceId
const GetDevicesParamsSchema = z.object({
    deviceId: z.string().refine((val) => Types.ObjectId.isValid(val), {
        error: 'Invalid deviceId',
        path: ['deviceId'],
    }),
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

// Schema body patch /devices/:deviceId
const PatchDevicesBodySchema = z.object({
    name: z.string().min(3).max(15),
});

// Schema params patch /devices/:deviceId
const PatchDevicesParamsSchema = GetDevicesParamsSchema;

// Schema params delete /devices/:id
const DeleteDevicesParamsSchema = GetDevicesParamsSchema;

// Esportazione schemi
export {
    GetDevicesParamsSchema,
    PostDevicesBodySchema,
    PatchDevicesBodySchema,
    PatchDevicesParamsSchema,
    DeleteDevicesParamsSchema,
};
