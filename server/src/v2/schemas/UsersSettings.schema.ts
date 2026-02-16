// Importazione moduli
import z from 'zod';

// Schema body patch /me/user-settings
const PatchUsersSettingsBodySchema = z.object({
    styleMode: z.enum(['light', 'dark']).optional(),
    units: z.enum(['metric', 'imperial']).optional(),
});

// Esportazione schemi
export { PatchUsersSettingsBodySchema };
