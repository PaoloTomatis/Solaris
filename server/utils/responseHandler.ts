// Importazione moduli
import type { Response } from 'express';

// Funzione gestore risposte
function resHandler<T>(
    res: Response,
    status: number = 500,
    data: T | null = null,
    message: string = 'Errore interno del server!',
    success: boolean = false
): void {
    res.status(status).json({ success, message, data, status });
}

// Esportazione funzione
export default resHandler;
