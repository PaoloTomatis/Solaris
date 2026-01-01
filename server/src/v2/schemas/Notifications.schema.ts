// Importazione moduli
import z from 'zod';
import { Types } from 'mongoose';
import { QuerySchema } from './Global.schema.js';
import sortParser from '../../global/utils/sortParser.js';

// Lista
const notificationSortFields = ['createdAt', 'updatedAt'];

// Schema query get /notifications
const GetNotificationsQuerySchema = z
    .object({
        sort: z
            .string()
            .optional()
            .transform((val) => (val ? sortParser(val) : []))
            .refine(
                (val) => {
                    val.every(
                        (obj) => !notificationSortFields.includes(obj.field)
                    );
                },
                {
                    error: 'Invalid sort field (should be "createdAt" or "updatedAt")',
                    path: ['sort'],
                }
            ),
        type: z.enum(['error', 'warning', 'info', 'success']).optional(),
    })
    .extend(QuerySchema);

// Schema body post /notifications
const PostNotificationsBodySchema = z
    .object({
        userId: z.string().refine((val) => Types.ObjectId.isValid(val), {
            error: 'Invalid userId',
            path: ['userId'],
        }),
        irrigationId: z
            .string()
            .optional()
            .refine((val) => !val || Types.ObjectId.isValid(val), {
                error: 'Invalid irrigationId',
                path: ['irrigationId'],
            }),
        measurementId: z
            .string()
            .optional()
            .refine((val) => !val || Types.ObjectId.isValid(val), {
                error: 'Invalid measurementId',
                path: ['measurementId'],
            }),
        title: z.string().min(3).max(50),
        description: z.string().min(3).max(200),
        type: z.enum(['error', 'warning', 'info', 'success']),
    })
    .refine((val) => !(val.irrigationId && val.measurementId), {
        error: "IrrigationId and measurementId can't be both assigned",
        path: ['irrigationId', 'measurementId'],
    });

// Esportazione schemi
export { GetNotificationsQuerySchema, PostNotificationsBodySchema };
