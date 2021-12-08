import { Request, Response } from 'express';
import db from '../database/connections';
import response from '../utils/messagesReponse';

export default class AuthorsController {
  async index(req = Request, res = Response) {
    try {
      const authors = await db('authors');
      return res.status(200).json({
        error: false,
        data: authors,
      });
    } catch (err) {
      console.log(`Error in AUTHORS controller ${err}`);
      res.status(500).json({
        error: true,
        message: response.showMessage(500),
      });
    }
  }

  async create(req = Request, res = Response) {
    const { name } = req.body;
    const trx = await db.transaction();
    try {
      await trx('authors').insert({ name });
      await trx.commit();
      return res.status(201).send();
    } catch (err) {
      console.log(`Error in AUTHORS controller ${err}`);
      await trx.rollback();
      res.status(500).json({
        error: true,
        message: response.showMessage(500),
      });
    }
  }

  async update(req = Request, res = Response) {
    const { id } = req.params;
    const data = req.body;

    try {
      if (await db('authors').where('id', '=', id).update(data)) {
        res.send();
      } else {
        res.status(404).json({
          error: false,
          message: response.showMessage(404, 'Author'),
        });
      }
    } catch (err) {
      console.log(`Error in AUTHORS controller ${err}`);
      return res.status(500).json({
        error: true,
        message: response.showMessage(500),
      });
    }
  }
}
