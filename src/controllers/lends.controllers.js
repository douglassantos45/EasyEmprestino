import { Request, Response } from 'express';
import db from '../database/connections';

import handleDateConvertMs from '../utils/dateConvertMS';

export default class LendsController {
  async index(req = Request, res = Response) {
    try {
      const data = await db('lends')
        .join('publications', 'lends.publication_id', '=', 'publications.id')
        .select(['lends.*', 'publications.*']);

      res.status(200).json(data);
    } catch (err) {
      console.log(`Erro no index lends controller ${err}`);
      res.status(500).json({
        error: err,
        message: 'Ocorreu um erro interno',
      });
    }
  }

  async create(req = Request, res = Response) {
    const { publicationsId } = req.body;
    const employeeId = req.params.id;

    const newDateMs = handleDateConvertMs(new Date());

    const trx = await db.transaction();
    try {
      await trx('lends').insert({
        inicio: newDateMs,
        termino: newDateMs + 604800000,
        employee_id: employeeId,
        publication_id: publicationsId,
      });

      await trx.commit();

      res.status(201).send();
    } catch (err) {
      console.log(`Erro no index create controller ${err}`);
      res.status(500).json({
        error: err,
        message: 'Ocorreu um erro interno',
      });
    }
  }
}
