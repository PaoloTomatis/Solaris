// Importazione moduli
import { rooms } from '../../server.js';
import type { AuthenticatedWS as AuthenticatedWSV1 } from '../../v1/types/types.js';
import type { AuthenticatedWS as AuthenticatedWSV2 } from '../../v2/types/types.js';

// Firma funzione v1
function joinRoom(ws: AuthenticatedWSV1, roomName: string, version: 1): void;
// Firma funzione v2
function joinRoom(ws: AuthenticatedWSV2, roomName: string, version: 2): void;

// Funzione gestione partecipazione stanza
function joinRoom(
    ws: AuthenticatedWSV1 | AuthenticatedWSV2,
    roomName: string,
    version: 1 | 2
) {
    // Controllo esistenza stanza
    if (!rooms.has(roomName)) rooms.set(roomName, new Set());

    // Salvataggio stanza
    rooms.get(roomName)!.add(ws);

    // Salvataggio info stanza
    (ws as any).room = roomName;
}

// Funzione gestione uscita stanza
function leaveRoom(ws: AuthenticatedWSV1 | AuthenticatedWSV2) {
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
