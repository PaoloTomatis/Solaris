// Importazione moduli
import type { Socket } from 'socket.io';
import type { WebSocket } from 'ws';

// Interfaccia utente
interface UserType {
    id: string;
    email: string;
    role: string;
    updatedAt: Date;
    createdAt: Date;
}

// Interfaccia dispositivo
interface DeviceType {
    id: string;
    key: string;
    name: string;
    prototype: string;
    userId: string;
    mode: string;
    activatedAt: Date;
    updatedAt: Date;
    createdAt: Date;
}

// Interfaccia socket
interface AuthenticatedWS extends WebSocket {
    user?: UserType;
    device?: DeviceType;
}

// Esportazione interfacce
export type { UserType, DeviceType, AuthenticatedWS };
