// Importazione moduli
import { model, Schema, type ObjectId } from 'mongoose';

// Tipo utenti
interface UsersType {
    _id: ObjectId;
    email: string;
    psw: string;
    role: 'user' | 'admin';
    schemaVersion: number;
    updatedAt: Date;
    createdAt: Date;
}

// Schema utenti
const UsersSchema = new Schema(
    {
        email: { type: String, required: true, unique: true },
        psw: { type: String, required: true },
        role: { type: String, default: 'user', enum: ['user', 'admin'] },
        schemaVersion: { type: Number, default: 1 },
    },
    { timestamps: true }
);

// Esportazione modello utenti
export default model<UsersType>('Users', UsersSchema);
// Esportazione tipo utenti
export type { UsersType };
