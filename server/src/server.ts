// Importazione moduli
import express, {
    type Request,
    type Response,
    type NextFunction,
} from 'express';
import helmet from 'helmet';
import type { AuthenticatedWS as AuthenticatedWSV1 } from './v1/types/types.js';
import type { AuthenticatedWS as AuthenticatedWSV2 } from './v2/types/types.js';
import { createServer } from 'http';
import { WebSocketServer } from 'ws';
import cors from 'cors';
import { configDotenv } from 'dotenv';
import connectDB from './global/database/connection.database.js';
import resHandlerV1 from './v1/utils/responseHandler.js';
import resHandlerV2 from './v2/utils/responseHandler.js';
import cookieParser from 'cookie-parser';
import authRouterV1 from './v1/routers/auth.router.js';
import apiRouterV1 from './v1/routers/api.router.js';
import authRouterV2 from './v2/routers/auth.router.js';
import apiRouterV2 from './v2/routers/api.router.js';
import {
    jwtMiddlewareRest as jwtMiddlewareRestV1,
    jwtMiddlewareWS as jwtMiddlewareWSV1,
} from './v1/middleware/jwt_verify.middleware.js';
import {
    jwtMiddlewareRest as jwtMiddlewareRestV2,
    jwtMiddlewareWS as jwtMiddlewareWSV2,
} from './v2/middlewares/jwt.middleware.js';
import statusV1 from './v1/controllers/status.controller.js';
import statusV2 from './v2/controllers/status.controller.js';
import irrigationV1 from './v1/controllers/irrigation.controller.js';
import { joinRoom, leaveRoom } from './global/utils/wsRoomHandlers.js';

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
const wss = new WebSocketServer({ server });

// Definizione stanze
const rooms: Map<
    string,
    Set<AuthenticatedWSV1 | AuthenticatedWSV2>
> = new Map();

// Connessione socket
wss.on('connection', async (ws: AuthenticatedWSV1 | AuthenticatedWSV2, req) => {
    // Gestione connessione
    try {
        // Ricavo dati richiesta
        const url = new URL(req.url ?? '', `http://${req.headers.host}`);
        const version = url.searchParams.get('v');

        // Controllo versione
        if (version == '1') {
            // Middleware autenticazione
            await jwtMiddlewareWSV1(ws as AuthenticatedWSV1, req);

            // Controllo utente o dispositivo
            if (ws.user) {
                // Inserimento stanza privata
                joinRoom(ws as AuthenticatedWSV1, `USER-${ws.user.id}`, 1);
            } else if (ws.device) {
                // Inserimento stanza privata
                joinRoom(ws as AuthenticatedWSV1, `DEVICE-${ws.device.id}`, 1);
            }
        } else if (version == '2') {
            // Middleware autenticazione
            await jwtMiddlewareWSV2(ws as AuthenticatedWSV2, req);

            // Controllo utente o dispositivo
            if (ws.user) {
                // Inserimento stanza privata
                joinRoom(ws as AuthenticatedWSV2, `USER-${ws.user.id}`, 2);
            } else if (ws.device) {
                // Inserimento stanza privata
                joinRoom(ws as AuthenticatedWSV2, `DEVICE-${ws.device.id}`, 2);
            }
        } else throw new Error('Invalid version');
    } catch (err) {
        ws.close(1008, 'Authentication failed');
    }

    // Gestione messaggi
    ws.on('message', async (raw) => {
        // Gestione errori
        try {
            // Controllo utente o dispositivo
            if (ws.user) {
                // Ricevo dati richiesta
                const { event, data }: { event: string; data: Object } =
                    JSON.parse(raw.toString());

                // Controllo dati richiesta
                if (!event || !data)
                    resHandlerV1(
                        `USER-${ws.user?.id}`,
                        400,
                        null,
                        'Evento o dati mancanti o invalidi!',
                        false,
                        'ws'
                    );

                // Gestore evento stato
                if (event === 'v1/irrigation') {
                    await irrigationV1(ws as AuthenticatedWSV1, data);
                }
            } else if (ws.device) {
                // Ricevo dati richiesta
                const { event, data }: { event: string; data: Object } =
                    JSON.parse(raw.toString());

                // Controllo dati richiesta
                if (!event || !data)
                    resHandlerV1(
                        `DEVICE-${ws.device?.id}`,
                        400,
                        null,
                        'Evento o dati mancanti o invalidi!',
                        false,
                        'ws'
                    );

                // Gestore evento stato v1
                if (event === 'v1/status')
                    statusV1(ws as AuthenticatedWSV1, data);

                // Gestore evento stato v2
                if (event === 'v2/status')
                    statusV2(ws as AuthenticatedWSV2, data);
            }
        } catch (error: unknown) {
            // Errore in console
            console.error(error);
            const errorMsg =
                error instanceof Error
                    ? error?.message || 'Errore interno del server!'
                    : 'Errore sconosciuto!';
            // Risposta finale
            if (ws.user)
                resHandlerV1(
                    `USER-${ws.user.id}`,
                    500,
                    null,
                    errorMsg,
                    false,
                    'ws'
                );
            else if (ws.device)
                resHandlerV1(
                    `USER-${ws.device.id}`,
                    500,
                    null,
                    errorMsg,
                    false,
                    'ws'
                );
        }
    });

    // Evento disconnessione
    ws.on('close', (code, reason) => {
        leaveRoom(ws as AuthenticatedWSV1);
        // Debug disconnessione
        // console.log('Connessione chiusa', code, reason.toString());
    });
});

// Middleware helmet
app.use(helmet());
// Middleware cors
app.use(
    cors({
        origin: process.env.CLIENT_URL || 'http://localhost:5173',
        methods: ['GET', 'POST', 'PATCH', 'DELETE'],
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
    return resHandlerV1(
        res,
        200,
        null,
        "This is the API of SOLARIS HUB, the use is forbidden for commercial use. Normally your requests would be blocked by CORS if the url isn't recognized in the whitelist. USE AT YOUR OWN RISK (for private use only, not commercial)",
        true
    );
});

// Rotta autenticazione
app.use('/v1/auth', authRouterV1);

// Rotta api v1
app.use('/v1/api', jwtMiddlewareRestV1, apiRouterV1);

// Rotta autenticazione
app.use('/v2/auth', authRouterV2);

// Rotta api v2 (utilizzo autenticazione v1 solo per testing)
app.use('/v2/api', jwtMiddlewareRestV2, apiRouterV2);

// Rotta 404
app.use((req: Request, res: Response) => {
    return resHandlerV1(
        res,
        404,
        null,
        'Pagina non trovata o disponibile!',
        false
    );
});

// Middleware errori
app.use((err: unknown, req: Request, res: Response, next: NextFunction) => {
    // Errore in console
    console.error(err);
    const errorMsg =
        err instanceof Error
            ? err?.message || 'Errore interno del server!'
            : 'Errore sconosciuto!';

    // Risposta finale
    return resHandlerV2(res, false, 500, errorMsg);
});

// Funzione avvio
async function start() {
    // Controllo variabili d'ambiente
    if (
        !process.env.JWT_ACCESS ||
        !process.env.JWT_REFRESH ||
        !process.env.PORT ||
        !process.env.CLIENT_URL ||
        !process.env.DB_URL
    )
        throw new Error('Environment variables are missing');

    // Connessione database
    await connectDB();

    // Attivazione server
    server.listen(PORT, () => console.log(`Server online at port ${PORT}`));
}

// Attivazione script
start();

export { wss, rooms };
