// Importazione moduli
import z from 'zod';

// Schema body /user-login
const UsersLoginBodySchema = z.object({
    email: z.email(),
    psw: z.string().regex(/^(?=.*\d)(?=.*[^a-zA-Z0-9]).{8,255}$/),
});

// Schema body /device-login
const DevicesLoginBodySchema = z.object({
    key: z.string().min(10),
    psw: z.string().regex(/^(?=.*\d)(?=.*[^a-zA-Z0-9]).{8,255}$/),
});

// Schema body /register
const UsersRegisterBodySchema = UsersLoginBodySchema;

// Esportazione schemi
export {
    UsersLoginBodySchema,
    DevicesLoginBodySchema,
    UsersRegisterBodySchema,
};
