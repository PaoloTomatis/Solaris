// Importazione moduli
import mongoose from 'mongoose';

interface UserType {
    id: mongoose.Types.ObjectId;
    email: string;
    role: string;
    createdAt: Date;
}

// Esportazione interfacce
export type { UserType };
