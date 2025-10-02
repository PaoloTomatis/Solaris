// Importazione moduli
import { Schema, model, type ObjectId } from 'mongoose';

// Interfaccia dati
interface DataType {
    _id: ObjectId;
    desc: string;
    link: string;
    read: boolean;
    date: Date;
    humI: number | [number, number];
    humE: number;
    temp: number;
    lum: number;
    interval: number;
    deviceId: ObjectId;
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

// Schema dato
const DataSchema = new Schema(
    {
        desc: { type: String },
        link: { type: String, default: process.env.CLIENT_URL || null },
        read: { type: Boolean, default: false },
        date: { type: Date, default: () => new Date() },
        humI: { type: Schema.Types.Mixed },
        humE: { type: Number },
        temp: { type: Number },
        lum: { type: Number },
        interval: { type: Number },
        deviceId: {
            type: Schema.Types.ObjectId,
            required: true,
            ref: 'Device',
        },
        type: {
            type: String,
            enum: [
                'log_error',
                'log_info',
                'log_warning',
                'log_irrigation_auto',
                'log_irrigation_config',
                'data_config',
                'data_auto',
            ],
            default: 'log_info',
        },
    },
    { timestamps: true }
);

// Esportazione modello
export default model<DataType>('Data', DataSchema);
export type { DataType };
