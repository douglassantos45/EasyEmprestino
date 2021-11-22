import { Request, Response } from 'express';
import db from '../database/connections';

import handleDateConvertMs from '../utils/dateConvertMS';

export default class LendsController {
  async index(req = Request, res = Response) {
    try {
      const publications = await db('lends')
        .join('publications', 'lends.publication_id', '=', 'publications.id')
        .join('students', 'lends.student_id', '=', 'students.id')
        .join('employee', 'lends.employee_id', '=', 'employee.id')
        .join(
          'knowledge_areas',
          'publications.knowledge_area_id',
          '=',
          'knowledge_areas.id',
        )
        .select([
          'lends.*',
          'publications.*',
          ['students.nome', 'students.matricula'],
          'knowledge_areas.tipo',
          'employee.nome',
        ]);

      publications.map(item => {
        delete item.id, delete item.knowledge_area_id;
      });
      res.status(200).json(publications);
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
      const [publication] = await trx('lends').where(
        'lends.publication_id',
        '=',
        publicationsId,
      );

      if (!publication) {
        await trx('lends').insert({
          inicio: newDateMs,
          termino: newDateMs + 604800000,
          employee_id: employeeId,
          publication_id: publicationsId,
        });
        res.status(201).send();
      } else {
        res.status(204).send();
      }
      await trx.commit();
    } catch (err) {
      await trx.rollback();
      console.log(`Erro no index create controller ${err}`);
      res.status(500).json({
        error: err,
        message: 'Ocorreu um erro interno',
      });
    }
  }
}
