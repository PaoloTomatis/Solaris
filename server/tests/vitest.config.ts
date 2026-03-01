// Importazione moduli
import { defineConfig } from 'vitest/config';

// Esportazione configurazione
export default defineConfig({
    test: {
        globals: true,
        environment: 'node',
        include: ['./**/**/*.test.ts'],
        clearMocks: true,
    },
});
