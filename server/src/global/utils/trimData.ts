// Importazione moduli
import DataModel from '../../v1/models/Data.model.js';

// Funzione eliminazione dati
async function trimData(deviceId: string, type: string, maxLength = 50) {
    // Ricavo conteggio dati database
    const count = await DataModel.countDocuments({ deviceId, type });

    // Controllo conteggio
    if (count <= maxLength) return;
    const toDelete = count - maxLength;

    // Ricavo dati database
    const oldRecords = await DataModel.find({ deviceId, type })
        .sort({ createdAt: 1 })
        .limit(toDelete)
        .select('_id');

    // Eliminazione dati database
    await DataModel.deleteMany({ _id: { $in: oldRecords.map((r) => r._id) } });
}

// Esportazione funzione
export default trimData;
