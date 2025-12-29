// Importazione moduli
import { Router } from 'express';
import {
    getData,
    postData,
    patchData,
    deleteData,
} from '../controllers/data.controller.js';
import rateLimit from 'express-rate-limit';
import {
    getRequestsLimiter,
    postRequestsLimiter,
    patchRequestsLimiter,
    deleteRequestsLimiter,
} from '../../global/utils/rateLimit.js';

// Creazione router
const dataRouter = Router();

// Rotte get, post, patch, delete data
dataRouter
    .get('/', rateLimit(getRequestsLimiter), getData)
    .post('/', rateLimit(postRequestsLimiter), postData)
    .patch('/:id', rateLimit(patchRequestsLimiter), patchData)
    .delete('/', rateLimit(deleteRequestsLimiter), deleteData);

// Esportazione router
export default dataRouter;
