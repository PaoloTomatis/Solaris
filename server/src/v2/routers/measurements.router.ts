// Importazione moduli
import { Router } from 'express';
import {
    deleteMeasurementsController,
    getMeasurementsController,
    postMeasurementsController,
} from '../controllers/measurements.controller.js';

// Dichiarazione router
const measurementsRouter = Router();

// Definizione rotte
measurementsRouter
    .get('/', getMeasurementsController)
    .post('/', postMeasurementsController)
    .delete('/', deleteMeasurementsController);

// Esportazione router
export default measurementsRouter;
