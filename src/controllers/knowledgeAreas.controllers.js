/* eslint-disable no-unused-vars */
/* eslint-disable class-methods-use-this */
import { Request, Response } from 'express';
import db from '../database/connections';

export default class KnowledgeAreasController {
  async index(req = Request, res = Response) {
    try {
      const data = await db.select().from().table('knowledge_areas');

      res.json(data);
    } catch (err) {
      console.log(`Erro no knowledge_areas_controller ${err}`);
      res.status(500).json({
        error: err,
        message: 'Erro não esperado.',
      });
    }
  }

  async create(req = Request, res = Response) {
    const { tipo } = req.body;
    const employeeId = req.params.id;

    const trx = await db.transaction();

    try {
      await trx('knowledge_areas').insert({
        tipo,
        employee_id: employeeId,
      });
      await trx.commit(); //Salvando os dados no banco

      res.status(201).send();
    } catch (err) {
      await trx.rollback(); //Desfazendo qualquer erro
      console.log(`Erro no knowledge_areas_controller ${err}`);
      res.status(500).json({
        error: err,
        message: 'Erro não esperado.',
      });
    }
  }
}
