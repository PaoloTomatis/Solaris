// Importazione moduli
import z from 'zod';
import { QuerySchema } from './Global.schema.js';
import { Types } from 'mongoose';
import sortParser from '../../global/utils/sortParser.js';

// Lista campi consentiti
const irrigationSortFields = ['createdAt', 'updatedAt', 'irrigatedAt'];

// Schema query get /irrigations
const GetIrrigationsQuerySchema = z
    .object({
        deviceId: z.string().refine((val) => Types.ObjectId.isValid(val), {
            error: 'Invalid deviceId',
            path: ['deviceId'],
        }),
        sort: z
            .string()
            .optional()
            .transform((val) => (val ? sortParser(val) : []))
            .refine((val) => {
                val.every((obj) => !irrigationSortFields.includes(obj.field), {
                    error: 'Invalid sort field (should be "createdAt", "updatedAt", "irrigatedAt" or "interval")',
                    path: ['sort'],
                });
            }),
        type: z.enum(['config', 'auto']).optional(),
    })
    .extend(QuerySchema);

// Schema body post /irrigations/execute
const PostIrrigationsExecuteBodySchema = z.object({
    interval: z.number().int().positive(),
});

// Schema body post /irrigations
const PostIrrigationsBodySchema = z.object({
    temp: z.number().min(-50).max(100),
    lum: z.number().min(0).max(100),
    humE: z.number().min(0).max(100),
    humIBefore: z.number().min(0).max(100),
    humIAfter: z.number().min(0).max(100),
    interval: z.number().int().positive(),
    type: z.enum(['config', 'auto']),
    irrigatedAt: z
        .preprocess(
            (val) => (typeof val === 'string' ? new Date(val) : null),
            z.date()
        )
        .optional()
        .default(() => new Date()),
});

// Esportazione schemi
export {
    GetIrrigationsQuerySchema,
    PostIrrigationsExecuteBodySchema,
    PostIrrigationsBodySchema,
};
