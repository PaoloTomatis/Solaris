// Importazione moduli
import { Router } from 'express';
import {
    getMeasurementsController,
    postMeasurementsController,
} from '../controllers/measurements.controller.js';

// Dichiarazione router
const measurementsRouter = Router();

// Definizione rotte
measurementsRouter
    .get('/', getMeasurementsController)
    .post('/', postMeasurementsController);

// Esportazione router
export default measurementsRouter;
