// Importazione moduli
import express from 'express';
import { createServer } from 'http';
import { Server } from 'socket.io';
import cors from 'cors';
import { configDotenv } from 'dotenv';
import connectDB from './database/connection.database.js';
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
    res.status(200).send({
        success: true,
        data: [],
        message: `API SOLARIS HUB --> status online`,
        status: 200,
    });
});
// Rotta 404
app.use((req, res) => {
    res.status(404).send({
        success: false,
        data: [],
        message: 'Pagina non trovata o disponibile!',
        status: 404,
    });
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