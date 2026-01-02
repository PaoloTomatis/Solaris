// Importazione moduli
import { Router } from 'express';
import {
    getIrrigationsController,
    postIrrigationsController,
} from '../controllers/irrigations.controller.js';

// Dichiarazione router
const irrigationsRouter = Router();

// Definizione rotte
irrigationsRouter
    .get('/', getIrrigationsController)
    .post('/', postIrrigationsController);

// Esportazione router
export default irrigationsRouter;
