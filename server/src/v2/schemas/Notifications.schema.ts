// Importazione moduli
import z from 'zod';
import { Types } from 'mongoose';
import { baseQuerySchema } from './Global.schema.js';
import sortParser from '../../global/utils/sortParser.js';

// Lista
const notificationSortFields = ['createdAt', 'updatedAt'];

// Schema query get /notifications
const GetNotificationsQuerySchema = z
    .object({
        ...baseQuerySchema,
        deviceId: z
            .string()
            .refine((val) => !val || Types.ObjectId.isValid(val), {
                error: 'Invalid deviceId',
            }),
        sort: z
            .string()
            .optional()
            .transform((val) => (val ? sortParser(val) : []))
            .refine(
                (val) => {
                    return val.every(
                        (obj) => !notificationSortFields.includes(obj.field)
                    );
                },
                {
                    error: 'Invalid sort field (should be "createdAt" or "updatedAt")',
                }
            ),
        type: z.enum(['error', 'warning', 'info', 'success']).optional(),
    })
    .refine((val) => !val.from || !val.to || val.from <= val.to, {
        error: 'Invalid from/to range',
        path: ['from', 'to'],
    });

// Schema body post /notifications
const PostNotificationsBodySchema = z
    .object({
        irrigationId: z
            .string()
            .optional()
            .refine((val) => !val || Types.ObjectId.isValid(val), {
                error: 'Invalid irrigationId',
            }),
        measurementId: z
            .string()
            .optional()
            .refine((val) => !val || Types.ObjectId.isValid(val), {
                error: 'Invalid measurementId',
            }),
        title: z.string().min(3).max(50),
        description: z.string().min(3).max(200),
        type: z.enum(['error', 'warning', 'info', 'success']),
    })
    .refine((val) => !(val.irrigationId && val.measurementId), {
        message: "IrrigationId and measurementId can't be both assigned",
        path: ['irrigationId', 'measurementId'],
    });

// Esportazione schemi
export { GetNotificationsQuerySchema, PostNotificationsBodySchema };
