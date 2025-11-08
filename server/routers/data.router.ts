// Importazione moduli
import { Router } from 'express';
import {
    getData,
    postData,
    patchData,
    deleteData,
} from '../controllers/data.controller.js';

// Creazione router
const dataRouter = Router();

// Rotte get, post, patch, delete data
dataRouter
    .get('/', getData)
    .post('/', postData)
    .patch('/:id', patchData)
    .delete('/', deleteData);

// Esportazione router
export default dataRouter;
