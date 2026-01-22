// Importazione moduli
import { Router } from 'express';
import {
    deleteNotificationsController,
    getNotificationsController,
    postNotificationsController,
} from '../controllers/notifications.controller.js';

// Dichiarazione router
const notificationsRouter = Router();

// Definizione rotte
notificationsRouter
    .get('/', getNotificationsController)
    .post('/', postNotificationsController)
    .delete('/', deleteNotificationsController);

// Esportazione router
export default notificationsRouter;
