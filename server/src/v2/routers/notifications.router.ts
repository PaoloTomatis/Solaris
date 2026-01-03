// Importazione moduli
import { Router } from 'express';
import {
    getNotificationsController,
    postNotificationsController,
} from '../controllers/notifications.controller.js';

// Dichiarazione router
const notificationsRouter = Router();

// Definizione rotte
notificationsRouter
    .get('/', getNotificationsController)
    .post('/', postNotificationsController);

// Esportazione router
export default notificationsRouter;
