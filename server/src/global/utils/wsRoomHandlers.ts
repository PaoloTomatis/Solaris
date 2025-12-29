// Importazione moduli
import { rooms } from '../server.js';
import type { AuthenticatedWS } from '../types/types.js';

// Funzione gestione partecipazione stanza
function joinRoom(ws: AuthenticatedWS, roomName: string) {
    // Controllo esistenza stanza
    if (!rooms.has(roomName)) rooms.set(roomName, new Set());

    // Salvataggio stanza
    rooms.get(roomName)!.add(ws);

    // Salvataggio info stanza
    (ws as any).room = roomName;
}

// Funzione gestione uscita stanza
function leaveRoom(ws: AuthenticatedWS) {
    // Ricavo dati da ws
    const roomName = (ws as any).room;

    // Controllo stanza
    if (!roomName) return;

    // Eliminazione stanza
    rooms.get(roomName)?.delete(ws);
}

// Funzione invio dati stanza
function emitToRoom(roomName: string, message: any) {
    // Ricavo clients
    const clients = rooms.get(roomName);

    // Controllo clients
    if (!clients) return;

    // Invio dati ai clients
    for (const client of clients) {
        // Controllo stato client
        if (client.readyState === client.OPEN) {
            client.send(JSON.stringify(message));
        }
    }
}

// Esportazione funzioni
export { joinRoom, leaveRoom, emitToRoom };
