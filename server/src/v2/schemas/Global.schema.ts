// Importazione moduli
import z from 'zod';

// Schema query get irrigations
const baseQuerySchema = {
    limit: z.coerce.number().int().positive().max(100).default(50),
    from: z.coerce.date().optional(),
    to: z.coerce.date().optional(),
};

// Esportazione schemi
export { baseQuerySchema };
