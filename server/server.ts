// Importazione moduli
import express, { type Request, type Response } from 'express';
import type { AuthenticatedSocket } from './types/types.js';
import { createServer } from 'http';
import { Server } from 'socket.io';
import cors from 'cors';
import { configDotenv } from 'dotenv';
import connectDB from './database/connection.database.js';
import resHandler from './utils/responseHandler.js';
import cookieParser from 'cookie-parser';
import authRouter from './routers/auth.router.js';
import apiRouter from './routers/api.router.js';
import {
    jwtMiddlewareRest,
    jwtMiddlewareWS,
} from './middleware/jwt_verify.middleware.js';
import status from './controllers/status.controller.js';
import irrigation from './controllers/irrigation.controller.js';

// Configurazione
configDotenv();

// Definizione porta
const PORT: number =
    (typeof process.env.PORT === 'string'
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

// Middleware autenticazione (socket)
io.use(jwtMiddlewareWS);

// Connessione socket
io.on('connection', (socket: AuthenticatedSocket) => {
    // Controllo utente o dispositivo
    if (socket.user) {
        // Inserimento stanza privata
        socket.join(`USER-${socket.user.id}`);

        // Gestore evento irrigazione
        socket.on('irrigation', async (data) => await irrigation(socket, data));
    } else if (socket.device) {
        // Inserimento stanza privata
        socket.join(`DEVICE-${socket.device.id}`);

        // Gestore evento stato
        socket.on('status', (data) => status(socket, data));
    }
});

// Middleware cors
app.use(
    cors({
        origin: process.env.CLIENT_URL || 'http://localhost:5173',
        credentials: true,
    })
);
// Middleware json
app.use(express.json());
// Middleware url
app.use(express.urlencoded());
// Middleware cookie
app.use(cookieParser());

// Rotta default
app.get('/', (req: Request, res: Response) => {
    return resHandler(
        res,
        200,
        null,
        "This is the API of SOLARIS HUB, the use is forbidden for commercial use. Normally your requests would be blocked by CORS if the url isn't recognized in the whitelist. USE AT YOUR OWN RISK (for private use only, not commercial)",
        true
    );
});

// Rotta autenticazione
app.use('/auth', authRouter);

// Rotta api
app.use('/api', jwtMiddlewareRest, apiRouter);

// Rotta 404
app.use((req: Request, res: Response) => {
    return resHandler(
        res,
        404,
        null,
        'Pagina non trovata o disponibile!',
        false
    );
});

// Funzione avvio
async function start() {
    // Connessione database
    await connectDB();
    // Attivazione server
    server.listen(PORT, () => console.log(`Server online at port ${PORT}`));
}

// Attivazione script
start();

export { io };
