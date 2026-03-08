// Importazione moduli
import z from 'zod';
import { Types } from 'mongoose';

// Schema params get /device-settings/:deviceId
const GetDevicesSettingsParamsSchema = z.object({
    deviceId: z.string().refine((val) => Types.ObjectId.isValid(val), {
        error: 'Invalid deviceId',
    }),
});

// Schema body patch /device-settings/:deviceId
const PatchDevicesSettingsBodySchema = z
    .object({
        mode: z.enum(['config', 'auto', 'safe']).optional(),
        humIMax: z.number().min(0).max(100).nullable().optional(),
        humIMin: z.number().min(0).max(100).nullable().optional(),
        kInterval: z.number().positive().nullable().optional(),
    })
    .refine(
        (val) => !val.humIMax || !val.humIMin || val.humIMax > val.humIMin,
        {
            error: 'HumIMax should be greater than humIMin',
            path: ['humIMax', 'humIMin'],
        },
    );

// Schema body patch /device-settings/:deviceId
const PatchCalibrationBodySchema = z.object({
    sensor: z.enum([
        'sensorHumIMin',
        'sensorHumIMax',
        'sensorLumMin',
        'sensorLumMax',
    ]),
    measurement: z.number().min(0).max(100),
});

// Schema body post /device-settings/:deviceId/calibration
const PostCalibrationBodySchema = z.object({
    sensor: z.enum([
        'sensorHumIMin',
        'sensorHumIMax',
        'sensorLumMin',
        'sensorLumMax',
    ]),
});

// Schema params post /device-settings/:deviceId/calibration
const PostCalibrationParamsSchema = GetDevicesSettingsParamsSchema;

// Schema params patch /device-settings/:deviceId
const PatchDevicesSettingsParamsSchema = GetDevicesSettingsParamsSchema;

// Esportazione schemi
export {
    GetDevicesSettingsParamsSchema,
    PostCalibrationBodySchema,
    PostCalibrationParamsSchema,
    PatchDevicesSettingsBodySchema,
    PatchDevicesSettingsParamsSchema,
    PatchCalibrationBodySchema,
};
