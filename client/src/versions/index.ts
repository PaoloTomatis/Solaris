// Importazione moduli
import pagesV1 from './v1';
import pagesV2 from './v2';

// Dichiarazione versione attiva
const ACTIVE_VERSION: number = import.meta.env.VITE_ACTIVE_VERSION;

// Controllo versione attiva
if (!ACTIVE_VERSION || isNaN(Number(ACTIVE_VERSION)))
    throw new Error('Version environment variable is missing or is invalid');

// Lista versioni
const versions = [pagesV1, pagesV2];

// Esportazione moduli
export { versions, ACTIVE_VERSION };
