import { Request, Response } from 'express';
import db from '../database/connections';

export default class StudentController {
  async create(req = Request, res = Response) {
    const data = req.body;
    const trx = await db.transaction();

    try {
      await trx('students').insert(data);

      await trx.commit();
      res.status(201).send();
    } catch (err) {
      console.log(`Erro no student controller ${err}`);
      res.status(500).json({
        error: err,
        message: 'Ocorreu um erro inesperado',
      });
    }
  }
}
