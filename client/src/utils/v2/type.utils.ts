// Interfaccia utente
interface User {
    id: string;
    email: string;
    updatedAt: Date;
    createdAt: Date;
}

// Interfaccia dispositivo
interface Device {
    id: string;
    name: string;
    prototypeModel: string;
    userId: string;
    activatedAt: Date;
    updatedAt: Date;
    createdAt: Date;
}

// Interfaccia irrigazioni
interface Irrigations {
    id: string;
    deviceId: string;
    temp: number;
    lum: number;
    humE: number;
    humIBefore: number;
    humIAfter: number;
    interval: number;
    type: 'config' | 'auto';
    irrigatedAt: Date;
    updatedAt: Date;
    createdAt: Date;
}

// Interfaccia misurazioni
interface Measurements {
    id: string;
    deviceId: string;
    temp: number;
    lum: number;
    humE: number;
    humI: number;
    measuredAt: Date;
    updatedAt: Date;
    createdAt: Date;
}

// Interfaccia notifiche
interface Notifications {
    id: string;
    irrigationId?: string;
    measurementId?: string;
    deviceId: string;
    title: string;
    description: string;
    type: 'error' | 'warning' | 'info' | 'success';
    updatedAt: Date;
    createdAt: Date;
}

// Interfaccia impostazioni utente
interface UserSettings {
    id: string;
    userId: string;
    styleMode: 'dark' | 'light';
    units: 'metric' | 'imperial';
    updatedAt: Date;
    createdAt: Date;
}

// Interfaccia impostazioni dispositivo
interface DeviceSettings {
    id: string;
    deviceId: string;
    mode: 'config' | 'auto' | 'safe';
    humIMax: number;
    humIMin: number;
    kInterval: number;
    updatedAt: Date;
    createdAt: Date;
}

// Tipo output api successo
interface APIResponseSuccess<T> {
    data: T;
}

// Tipo output api errore
interface APIResponseError {
    message: string;
}

// Esportazione interfacce
export type {
    User,
    Device,
    Irrigations,
    Measurements,
    Notifications,
    DeviceSettings,
    UserSettings,
    APIResponseSuccess,
    APIResponseError,
};
