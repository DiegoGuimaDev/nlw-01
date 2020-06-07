import knex from "../database";
import {Request, Response} from 'express';

class ItemsControllers {

    async lista(req: Request, res: Response) {

        const items = await knex('items').select('*');

        const serializedItems = items.map(item => ({
            id: item.id,
            title: item.title,
            imageUrl: `http://192.168.1.110:3333/uploads/${item.image}`
        }))

        return res.json(serializedItems);

    }

}

export default ItemsControllers;
