// Importazione moduli
import type { ObjectId } from 'mongoose';
import type { WebSocket } from 'ws';

// Interfaccia utente
interface UserType {
    id: string | ObjectId;
    email: string;
    role: 'user' | 'admin';
    updatedAt: Date;
    createdAt: Date;
}

// Interfaccia dispositivo
interface DeviceType {
    id: string | ObjectId;
    userId?: string | ObjectId;
    name: string;
    prototypeModel: string;
    activatedAt: Date;
    updatedAt: Date;
    createdAt: Date;
}

// Interfaccia socket
interface AuthenticatedWS extends WebSocket {
    user?: UserType;
    device?: DeviceType;
}

// Esportazione tipi
export type { UserType, DeviceType, AuthenticatedWS };
