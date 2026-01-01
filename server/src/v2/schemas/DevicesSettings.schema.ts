// Importazione moduli
import z from 'zod';
import { Types } from 'mongoose';

// Schema params get /device-settings/:deviceId
const GetDevicesSettingsParamsSchema = z.object({
    deviceId: z.string().refine((val) => Types.ObjectId.isValid(val), {
        error: 'Invalid deviceId',
        path: ['deviceId'],
    }),
});

// Schema body patch /device-settings/:deviceId
const PatchDevicesSettingsBodySchema = z
    .object({
        mode: z.enum(['config', 'auto', 'safe']).optional(),
        humIMax: z.number().min(0).max(100).optional(),
        humIMin: z.number().min(0).max(100).optional(),
        kInterval: z.number().positive().optional(),
    })
    .refine(
        (val) => !val.humIMax || !val.humIMin || val.humIMax > val.humIMin,
        {
            error: 'HumIMax should be greater than humIMin',
            path: ['humIMax', 'humIMin'],
        }
    );

// Schema params patch /device-settings/:deviceId
const PatchDevicesSettingsParamsSchema = GetDevicesSettingsParamsSchema;

// Esportazione schemi
export {
    GetDevicesSettingsParamsSchema,
    PatchDevicesSettingsBodySchema,
    PatchDevicesSettingsParamsSchema,
};
