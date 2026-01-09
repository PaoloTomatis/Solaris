// Importazione moduli
import z from 'zod';
import { baseQuerySchema } from './Global.schema.js';
import { Types } from 'mongoose';
import sortParser from '../../global/utils/sortParser.js';

// Lista
const measurementSortFields = ['createdAt', 'updatedAt', 'measuredAt'];

// Schema query get /measurements
const GetMeasurementsQuerySchema = z
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
                    return val.every(
                        (obj) => !measurementSortFields.includes(obj.field)
                    );
                },
                {
                    error: 'Invalid sort field (should be "createdAt", "updatedAt" or "measuredAt")',
                }
            ),
    })
    .refine((val) => !val.from || !val.to || val.from <= val.to, {
        error: 'Invalid from/to range',
        path: ['from', 'to'],
    });

// Schema body post /measurements
const PostMeasurementsBodySchema = z.object({
    temp: z.number().min(-50).max(100),
    lum: z.number().min(0).max(100),
    humE: z.number().min(0).max(100),
    humI: z.number().min(0).max(100),
    measuredAt: z
        .preprocess(
            (val) => (typeof val === 'string' ? new Date(val) : null),
            z.date()
        )
        .optional()
        .default(() => new Date()),
});

// Esportazione schemi
export { GetMeasurementsQuerySchema, PostMeasurementsBodySchema };
