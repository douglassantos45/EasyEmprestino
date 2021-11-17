/* eslint-disable class-methods-use-this */
import { Request, Response } from 'express';
import db from '../database/connections';

export default class EmployeeController {
  async index(req = Request, res = Response) {
    res.send('employee controller.');
  }

  async create(req = Request, res = Response) {
    const data = req.body;

    const trx = await db.transaction(); // Faz com que se ocorrer um erro em qualquer tabela, os dados não serão salvos

    try {
      await trx('employee').insert(data);
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
