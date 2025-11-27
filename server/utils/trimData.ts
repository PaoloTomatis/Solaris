// Importazione moduli
import DataModel from '../models/Data.model.js';

// Funzione eliminazione dati
async function trimData(deviceId: string, type: string, maxLength = 50) {
    // Ricavo conteggio dati database
    const count = await DataModel.countDocuments({ deviceId, type });

    // Controllo conteggio
    if (count <= maxLength) return;
    const toDelete = count - maxLength;

    // Eliminazione dati database
    await DataModel.find({ deviceId, type })
        .sort({ createdAt: 1 })
        .limit(toDelete)
        .deleteMany();
}

// Esportazione funzione
export default trimData;
