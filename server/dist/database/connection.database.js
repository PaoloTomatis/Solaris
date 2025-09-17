// Importazione moduli
import mongoose from 'mongoose';
// Funzione connessione al database
async function connectDB() {
    // Gestione errori
    try {
        // Connessione
        await mongoose.connect(process.env.DB_URL || 'mongodb://localhost:27017/solaris_db');
        console.log('Database connection active');
    }
    catch (error) {
        // Invio errore
        console.error(error);
        process.exit(1);
    }
}
// Esecuzione connessione
export default connectDB;
//# sourceMappingURL=connection.database.js.map