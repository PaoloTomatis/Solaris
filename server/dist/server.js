// Importazione moduli
import express from 'express';
import { createServer } from 'http';
import { Server } from 'socket.io';
import cors from 'cors';
import { configDotenv } from 'dotenv';
import connectDB from './database/connection.database.js';
import resHandler from './utils/responseHandler.js';
// Configurazione
configDotenv();
// Definizione porta
const PORT = (typeof process.env.PORT === 'string'
    ? parseInt(process.env.PORT)
    : process.env.PORT) || 5000;
// Definizione app
const app = express();
// Definizione server http
const server = createServer(app);
// Definizione websocket
const io = new Server(server, {
    cors: {
        origin: process.env.CLIENT_URL || 'http://localhost:5173',
        methods: ['GET', 'POST', 'PATCH', 'DELETE'],
    },
});
// Middleware cors
app.use(cors({
    origin: process.env.CLIENT_URL || 'http://localhost:5173',
    credentials: true,
}));
// Middleware json
app.use(express.json());
// Middleware url
app.use(express.urlencoded());
// Rotta default
app.get('/', (req, res) => {
    return resHandler(res, 200, null, "This is the API of SOLARIS HUB, the use is forbidden for commercial use. Normally your requests would be blocked by CORS if the url isn't recognized in the whitelist. USE AT YOUR OWN RISK (for private use only, not commercial)", true);
});
// Rotta 404
app.use((req, res) => {
    return resHandler(res, 404, null, 'Pagina non trovata o disponibile!', false);
});
async function start() {
    // Connessione database
    await connectDB();
    // Attivazione server
    server.listen(PORT, () => console.log(`Server online at port ${PORT}`));
}
// Attivazione script
start();
//# sourceMappingURL=server.js.map