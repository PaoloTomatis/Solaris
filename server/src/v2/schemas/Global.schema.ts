// Importazione moduli
import z from 'zod';

// Schema query get irrigations
const QuerySchema = z
    .object({
        limit: z
            .preprocess(
                (val) => Number(val),
                z
                    .number()
                    .int()
                    .positive()
                    .max(100)
                    .refine((val) => !isNaN(val), {
                        error: 'Invalid limit',
                        path: ['limit'],
                    })
            )
            .optional()
            .default(50),
        from: z
            .preprocess(
                (val) => (typeof val === 'string' ? new Date(val) : null),
                z.date()
            )
            .optional(),
        to: z
            .preprocess(
                (val) => (typeof val === 'string' ? new Date(val) : null),
                z.date()
            )
            .optional(),
    })
    .refine((val) => !(val.from && val.to) || val.from > val.to, {
        error: 'Invalid from/to range',
        path: ['from', 'to'],
    });

// Esportazione schemi
export { QuerySchema };
