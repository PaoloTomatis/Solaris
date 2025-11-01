// Interfaccia utente
interface User {
    id: string;
    email: string;
    role: 'admin' | 'user';
    updatedAt: Date;
    createdAt: Date;
}

// Interfaccia dispositivo
interface Device {
    id: string;
    name: string;
    prototype: string;
    userId: string;
    mode: 'config' | 'auto' | 'safe';
    activatedAt: Date;
    updatedAt: Date;
    createdAt: Date;
}

// Interfaccia dati
interface Data {
    id: string;
    desc: string;
    link?: string;
    read: boolean;
    date: Date;
    humI?: number;
    humE?: number;
    temp?: number;
    lum?: number;
    interval?: number;
    deviceId: string;
    type:
        | 'log_error'
        | 'log_info'
        | 'log_warning'
        | 'log_irrigation_auto'
        | 'log_irrigation_config'
        | 'data_config'
        | 'data_auto';
    updatedAt: Date;
    createdAt: Date;
}

// Interfaccia impostazioni dispositivo
interface DeviceSettings {
    id: string;
    humMax: number;
    humMin: number;
    kInterval: number;
    deviceId: string;
    updatedAt: Date;
    createdAt: Date;
}

// Interfaccia impostazioni utente
interface UserSettings {
    id: string;
    styleMode: 'dark' | 'light';
    units: 'metric' | 'imperial';
    userId: string;
    updatedAt: Date;
    createdAt: Date;
}

// Esportazione interfacce
export type { User, Device, Data, DeviceSettings, UserSettings };
