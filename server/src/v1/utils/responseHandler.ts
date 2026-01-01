// Importazione moduli
import type { Response } from 'express';
import { emitToRoom } from '../../global/utils/wsRoomHandlers.js';

// Firme funzione
function resHandler<T>(
    res: Response,
    status: number,
    data: T | null,
    message: string,
    success?: boolean,
    type?: 'rest'
): Response;

function resHandler<T>(
    res: string,
    status: number,
    data: T | null,
    message: string,
    success?: boolean,
    type?: 'ws'
): void;

// Funzione gestore risposte
function resHandler<T>(
    res: Response | string,
    status: number = 500,
    data: T | null = null,
    message: string = 'Errore interno del server!',
    success: boolean = false,
    type: 'rest' | 'ws' = 'rest'
): Response | void {
    if (type === 'rest') {
        return (res as Response)
            .status(status)
            .json({ success, message, data, status });
    } else {
        return emitToRoom(res as string, { success, message, data, status });
    }
}

// Esportazione funzione
export default resHandler;
