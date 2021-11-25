import { Request, Response } from 'express';
import db from '../database/connections';

import handleDateConvertMs from '../utils/dateConvertMS';
import msToDate from '../utils/msToDate';
import MessageResponse from '../utils/messagesReponse';

const response = new MessageResponse();

export default class LendsControllers {
  async index(req = Request, res = Response) {
    try {
      const publications = await db('lends')
        .join('publications', 'lends.publication_id', '=', 'publications.id')
        .join('employees', 'lends.employee_id', '=', 'employees.id')
        .join('students', 'lends.student_id', '=', 'students.id')
        .join(
          'knowledge_areas',
          'publications.knowledge_area_id',
          '=',
          'knowledge_areas.id',
        )
        .select([
          { student: 'students.name' },
          'students.*',
          'employees.*',
          'publications.*',
          'knowledge_areas.type',
          'lends.start',
          'lends.end',
        ]);

      const publicationsResponse = publications.map(response => {
        const newResponse = {
          student: {
            name: response.student,
            registration: response.registration,
            mail: response.mail,
          },
          publication: {
            quota: response.quota,
            title: response.title,
            authors: response.authors,
            knowledge_areas: response.type,
          },
          employee: {
            name: response.name,
          },
          lends: {
            start: msToDate(response.start),
            end: msToDate(response.end),
          },
        };

        return newResponse;
      });

      res.status(200).json({
        error: false,
        data: publicationsResponse,
      });
    } catch (err) {
      console.log(`Error in index lends controller ${err}`);
      res.status(500).json({
        error: true,
        message: response.showMessage(500),
      });
    }
  }

  async create(req = Request, res = Response) {
    const { publicationsId, studentId } = req.body;
    const employeeId = req.params.id;

    const newDateMs = handleDateConvertMs(new Date());
    const trx = await db.transaction();
    try {
      const [borrowedPublications] = await trx('lends').where(
        'lends.publication_id',
        '=',
        publicationsId,
      );

      if (!borrowedPublications) {
        await trx('lends').insert({
          start: newDateMs,
          end: newDateMs + 604800000,
          employee_id: employeeId,
          publication_id: publicationsId,
          student_id: studentId,
        });
        await trx.commit();

        res.status(201).send();
      } else {
        res.status(204).json({
          error: false,
          message: response.showMessage(
            204,
            'This publication has already been borrowed',
          ),
        });
      }
      await trx.commit();
    } catch (err) {
      await trx.rollback();
      console.log(`Error in index create controller ${err}`);
      res.status(500).json({
        error: true,
        message: response.showMessage(500),
      });
    }
  }
}
