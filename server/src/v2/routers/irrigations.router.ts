// Importazione moduli
import { Router } from 'express';
import {
    deleteIrrigationsController,
    getIrrigationsController,
    postIrrigationsController,
} from '../controllers/irrigations.controller.js';

// Dichiarazione router
const irrigationsRouter = Router();

// Definizione rotte
irrigationsRouter
    .get('/', getIrrigationsController)
    .post('/', postIrrigationsController)
    .delete('/', deleteIrrigationsController);

// Esportazione router
export default irrigationsRouter;
