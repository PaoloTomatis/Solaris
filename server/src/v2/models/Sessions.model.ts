// Importazione moduli
import { model, Schema, type ObjectId } from 'mongoose';

// Tipo sessioni
interface SessionsType {
    _id: ObjectId;
    userId?: ObjectId;
    deviceId?: ObjectId;
    refreshToken: string;
    ipAddress: string;
    userAgent: string;
    subject: string;
    status: 'active' | 'expired' | 'revoked';
    schemaVersion: number;
    updatedAt: Date;
    createdAt: Date;
}

// Schema sessioni
const SessionsSchema = new Schema(
    {
        userId: {
            type: Schema.Types.ObjectId,
            ref: 'Users',
        },
        deviceId: {
            type: Schema.Types.ObjectId,
            ref: 'Devices',
        },
        refreshToken: { type: String, required: true },
        ipAddress: { type: String, required: true },
        userAgent: { type: String, required: true },
        subject: {
            type: String,
            required: true,
            enum: ['user', 'device'],
        },
        status: {
            type: String,
            default: 'active',
            enum: ['active', 'expired', 'revoked'],
        },
        schemaVersion: { type: Number, default: 1 },
    },
    { timestamps: true }
);

// Cancellazione automatica dopo 24h
SessionsSchema.index({ createdAt: 1 }, { expireAfterSeconds: 24 * 60 * 60 });

// Esportazione modello sessioni
export default model<SessionsType>('Sessions', SessionsSchema);
// Esportazione tipo sessioni
export type { SessionsType };
