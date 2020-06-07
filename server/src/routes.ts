import express from 'express';
import {celebrate, Joi} from 'celebrate';

import PointsController from "./controllers/PointsController";
import ItemsControllers from "./controllers/ItemsControllers";

import multer from "multer";
import multerConfig from "./config/multer";

const pointsController = new PointsController();
const itemsControllers = new ItemsControllers();

const routes = express.Router();
const upload = multer(multerConfig);

routes.get('/items', itemsControllers.lista);

routes.post(
    '/points',
    upload.single('image'),
    celebrate({
       body: Joi.object().keys({
           name: Joi.string().required(),
           email: Joi.string().required().email(),
           whatsapp: Joi.string().required(),
           latitude: Joi.number().required(),
           longitude: Joi.number().required(),
           city: Joi.string().required(),
           uf: Joi.string().required().max(2),
           items: Joi.string().required()
       })
    },{
        abortEarly: false
    }),
    pointsController.create);
routes.get('/points/:id', pointsController.show);
routes.get('/points', pointsController.index);

export default routes;
