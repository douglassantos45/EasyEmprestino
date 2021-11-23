import { Request, Response } from 'express';
import db from '../database/connections';

import handleDateConvertMs from '../utils/dateConvertMS';

export default class LendsController {
  async index(req = Request, res = Response) {
    try {
      const publications = await db('lends')
        .join('publications', 'lends.publication_id', '=', 'publications.id')
        .join('employee', 'lends.employee_id', '=', 'employee.id')
        .join('students', 'lends.student_id', '=', 'students.id')
        .join(
          'knowledge_areas',
          'publications.knowledge_area_id',
          '=',
          'knowledge_areas.id',
        )
        .select([
          { student: 'students.nome' },
          'students.matricula',
          'employee.*',
          'publications.*',
          'knowledge_areas.tipo',
          'lends.inicio',
          'lends.termino',
        ]);

      const data = publications.map(response => {
        const newResponse = {
          student: {
            nome: response.student,
            matricula: response.matricula,
          },
          publication: {
            cota: response.cota,
            titulo: response.titulo,
            autor: response.autor,
            area_conhecimento: response.tipo,
          },
          employee: {
            nome: response.nome,
          },
          lends: {
            inicio: msToDate(response.inicio),
            termino: msToDate(response.termino),
          },
        };

        return newResponse;
      });

      /* publications.map(item => {
        delete item.id, delete item.knowledge_area_id, delete item.employee_id;
      }); */
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
    const { publicationsId, studentId } = req.body;
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
          student_id: studentId,
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
