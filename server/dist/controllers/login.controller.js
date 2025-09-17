// Importazione moduli
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import resHandler from '../utils/responseHandler.js';
// Gestore login
function login(req, res) {
    // Gestione errori
    try {
        const user = { id: 1, email: 'a' };
        // Firma access token
        const accessToken = process.env.JWT_ACCESS
            ? jwt.sign({ id: user.id, email: user.email }, process.env.JWT_ACCESS, { expiresIn: '1h' })
            : null;
        // Firma refresh token
        const refreshToken = process.env.JWT_REFRESH
            ? jwt.sign({ id: user.id, email: user.email }, process.env.JWT_REFRESH, { expiresIn: '3d' })
            : null;
        // Risposta finale
        return resHandler(res, 200, { accessToken }, 'Login effettuato con successo!', true);
    }
    catch (error) {
        // Errore in console
        console.error(error);
        // Risposta finale
        return resHandler(res, 500, null, error?.message || 'Errore interno del server!', false);
    }
}
export default login;
//# sourceMappingURL=login.controller.js.map