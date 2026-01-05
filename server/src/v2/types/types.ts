// Interfaccia utente
interface UserType {
    id: string;
    email: string;
    role: 'user' | 'admin';
    updatedAt: Date;
    createdAt: Date;
}

// Interfaccia dispositivo
interface DeviceType {
    id: string;
    userId?: string;
    name: string;
    prototypeModel: string;
    activatedAt: Date;
    updatedAt: Date;
    createdAt: Date;
}

// Esportazione tipi
export type { UserType, DeviceType };
