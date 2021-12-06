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
        .select([
          { student_name: 'students.name' },
          { student_registration: 'students.registration' },
          { student_mail: 'students.mail' },
          { employee_name: 'employees.name' },
          'publications.*',
          'lends.id',
          'lends.start',
          'lends.end',
        ]);

      const publicationsResponse = publications.map(response => {
        const newResponse = {
          id: response.id,
          student: {
            name: response.student_name,
            registration: response.student_registration,
            mail: response.student_mail,
          },
          publication: {
            quota: response.quota,
            title: response.title,
            authors: response.authors,
            knowledge_areas: response.type,
          },
          employee: {
            name: response.employee_name,
          },
          lends: {
            start: msToDate(response.start),
            end: msToDate(response.end),
          },
        };

        return newResponse;
      });

      if (!publicationsResponse) {
        return res.status(404).json({
          error: false,
          message: response.showMessage(404, 'Publication'),
        });
      }

      return res.status(200).json({
        error: false,
        data: publicationsResponse,
      });
    } catch (err) {
      console.log(`Error in LENDS controller ${err}`);
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
      const [employee] = await trx('employees').where('id', '=', employeeId);
      if (!employee) {
        await trx.commit();
        return res.status(404).json({
          error: false,
          message: response.showMessage(404, 'Employee'),
        });
      }

      const [student] = await trx('students').where('id', '=', studentId);
      if (!student) {
        await trx.commit();
        return res.status(404).json({
          error: false,
          message: response.showMessage(404, 'Student'),
        });
      }

      const [publication] = await trx('publications').where(
        'id',
        '=',
        publicationsId,
      );
      if (!publication) {
        await trx.commit();
        return res.status(404).json({
          error: false,
          message: response.showMessage(404, 'Publication'),
        });
      }

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

        res.status(201).send();
      } else {
        res.status(422).json({
          error: false,
          message: response.showMessage(422, 'Publication'),
        });
      }
      await trx.commit();
    } catch (err) {
      await trx.rollback();
      console.log(`Error in LENDS controller ${err}`);
      res.status(500).json({
        error: true,
        message: response.showMessage(500),
      });
    }
  }

  async remove(req = Request, res = Response) {
    const id = req.params.id;

    try {
      if (await db('lends').where('id', '=', id).del()) {
        res.send();
      } else {
        return res.status(404).json({
          error: false,
          message: response.showMessage(404),
        });
      }

      res.send();
    } catch (err) {
      console.log(`Error in LENDS controller ${err}`);
      res.status(500).json({
        error: true,
        message: response.showMessage(500),
      });
    }
  }

  async update(req = Request, res = Response) {
    const id = req.params.id;
    const data = req.body;

    try {
      if (await db('lends').where('id', '=', id).update(data)) {
        res.send();
      } else {
        res.status(404).json({
          error: false,
          message: response.showMessage(404),
        });
      }
    } catch (err) {
      console.log(`Error in LENDS controller ${err}`);
      return res.status(500).json({
        error: true,
        message: response.showMessage(500),
      });
    }
  }
}
