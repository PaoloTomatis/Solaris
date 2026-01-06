// Importazione moduli
import type { Response } from 'express';
import { emitToRoom } from '../../global/utils/wsRoomHandlers.js';

// Firme funzione
function resHandler<T>(
    res: Response,
    success: true,
    status: number,
    data: T | null,
    type?: 'rest'
): Response;

function resHandler<T>(
    res: Response,
    success: false,
    status: number,
    message: string,
    type?: 'rest'
): Response;

function resHandler<T>(
    res: string,
    success: true,
    status: number,
    data: T | null,
    type?: 'ws'
): void;

function resHandler<T>(
    res: string,
    success: boolean,
    status: number,
    message: string,
    type?: 'ws'
): void;

// Funzione gestore risposte
function resHandler<T>(
    res: Response | string,
    success: boolean,
    status: number = 500,
    data?: T | null,
    message?: string,
    type: 'rest' | 'ws' = 'rest'
): Response | void {
    if (type === 'rest') {
        return (res as Response)
            .status(status)
            .json(success ? { data } : { message });
    } else {
        return emitToRoom(res as string, success ? { data } : { message });
    }
}

// Esportazione funzione
export default resHandler;
