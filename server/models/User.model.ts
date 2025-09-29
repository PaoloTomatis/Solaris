// Importazione moduli
import { Schema, model, type ObjectId } from 'mongoose';

// Interfaccia utente
interface UserType {
    _id: ObjectId;
    role: 'admin' | 'user';
    email: string;
    psw: string;
    refreshToken: string;
    updatedAt: Date;
    createdAt: Date;
}

// Schema utente
const UserSchema = new Schema(
    {
        role: { type: String, default: 'user', enum: ['admin', 'user'] },
        email: { type: String, required: true, unique: true },
        psw: { type: String, required: true },
        refreshToken: { type: String, required: false },
    },
    { timestamps: true }
);

// Esportazione modello
export default model<UserType>('User', UserSchema);
export type { UserType };
