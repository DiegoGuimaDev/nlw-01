import knex from "../database";

import {Request, Response} from 'express';

class PointsController {

    async index(req: Request, res: Response) {
        const {city, uf, items} = req.query;

        const parsedItems = items != null ? String(items).split(',').map(i => i.trim()) : [];


        const points = await knex('points')
            .join('point_items', 'points.id', 'point_items.id_point')
            .where(function () {
                if (city) this.where('city', '=', String(city))
            })
            .where(function () {
                if (uf) this.where('uf', '=', String(uf));
            })
            .where(function () {
                if (parsedItems.length > 0) {
                    this.whereIn('point_items.id_item', parsedItems)
                }
            })
            .select('points.*')
            .distinct();

        const serializedPoints = points.map(point => {
            return {
                ...point,
                imageUrl: `http://192.168.1.110/uploads/${point.image}`
            }
        })

        return res.json(serializedPoints);


    }

    async show(req: Request, res: Response) {
        const {id} = req.params;

        const point = await knex('points').where('id', '=', id)
            .first();

        if (!point) return res.status(400).json({message: 'Point not found'});

        const items = await knex('items')
            .join('point_items', 'point_items.id_item', 'items.id')
            .where('point_items.id_point', id)
            .select('items.title')

        const serializedPoint = {
            ...point,
            imageUrl: `http://192.168.1.110/uploads/${point.image}`
        }

        return res.json({
            point: serializedPoint,
            items
        });
    }

    async create(req: Request, res: Response) {
        const {name, email, whatsapp, latitude, longitude, city, uf, items} = req.body;


        const trx = await knex.transaction();

        const insertedIds = await trx('points').insert({
            image: req.file.filename,
            name, email, whatsapp, latitude, longitude, city, uf
        })

        const pointId = insertedIds[0];

        await trx('point_items').insert(items
            .split(',')
            .map((item: string) => Number(item.trim()))
            .map((item: number) => ({
                id_point: pointId,
                id_item: item
            })))

        await trx.commit();

        return res.json({
            image: req.file.filename,
            name, email, whatsapp, latitude, longitude, city, uf,
            id: pointId
        });
    }

}

export default PointsController;
