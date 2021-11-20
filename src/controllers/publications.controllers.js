import { Request, Response } from 'express';
import db from '../database/connections';

export default class PublicationController {
  async index(req = Request, res = Response) {
    try {
      const data = await db.select().from().table('publications');

      res.status(200).json(data);
    } catch (err) {
      console.log(`Erro no publications controller ${err}`);
      res.status(500).json({
        error: err,
        message: 'Ocorreu um erro interno',
      });
    }
  }

  async create(req = Request, res = Response) {
    const { cota, titulo, autores, knowledge_area_id } = req.body;
    const employeeId = req.params.id;
    const trx = await db.transaction();

    try {
      await trx('publications').insert({
        cota,
        titulo,
        autores,
        employee_id: employeeId,
        knowledge_area_id,
      });

      await trx.commit();

      res.status(201).send();
    } catch (err) {
      console.log(`Erro no create publications controller ${err}`);
      res.status(500).json({
        error: err,
        message: 'Ocorreu um erro interno',
      });
    }
  }
}
