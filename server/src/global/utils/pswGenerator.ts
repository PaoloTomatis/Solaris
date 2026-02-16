// Importazione moduli
import crypto from 'crypto';

// Funzione generatore password
function pswGenerator(length = 16, log = false): string {
    // Caratteri consentiti
    const chars =
        'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()_-+=';

    // Bytes casuali
    const bytes = crypto.randomBytes(length);

    // Composizione psw
    const password = Array.from(bytes, (b) => chars[b % chars.length]).join('');

    // Controllo log
    if (log) console.log(password);

    // Ritorno psw
    return password;
}

// Esportazione funzione
export default pswGenerator;
