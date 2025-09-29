// Importazione moduli
import type { Socket } from 'socket.io';

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
interface AuthenticatedSocket extends Socket {
    user?: UserType;
    device?: DeviceType;
}

// Esportazione interfacce
export type { UserType, DeviceType, AuthenticatedSocket };
