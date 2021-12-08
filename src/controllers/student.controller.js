import { Request, Response } from 'express';
import { uuid } from 'uuidv4';
import db from '../database/connections';
import MessageResponse from '../utils/messagesReponse';
import msToDate from '../utils/msToDate';
import handleRandomNumber from '../utils/randomNumber';

const response = new MessageResponse();

export default class StudentController {
  async index(req = Request, res = Response) {
    try {
      const students = await db.select().from().table('students');

      res.status(200).json(students);
    } catch (err) {
      console.log(`Erro in STUDENT controller ${err}`);
      res.status(500).json({
        error: true,
        message: response.showMessage(500),
      });
    }
  }

  async show(req = Request, res = Response) {
    const { id } = req.params;
    try {
      const [student] = await db('students').where('id', '=', id);

      if (!student) {
        return res.status(404).json({
          error: false,
          message: response.showMessage(404),
          data: student,
        });
      }

      const publications = await db('lends')
        .join('students', 'lends.student_id', 'students.id')
        .where('student_id', '=', id)
        .join('publications', 'lends.publication_id', 'publications.id')
        .select([
          'publications.id',
          'publications.quotas',
          'publications.title',
          'lends.end',
        ]);

      const publication = publications.map(pb => {
        const response = {
          quotas: pb.quotas,
          title: pb.title,
          dateEnd: msToDate(pb.end),
        };

        return response;
      });

      const studentPub = {
        id: student.id,
        name: student.name,
        registration: student.registration,
        cpf: student.cpf,
        mail: student.mail,
        phone: student.phone,
        cep: student.cep,
        street: student.street,
        publications: publication,
      };
      res.status(200).json({
        error: false,
        data: studentPub,
      });
    } catch (err) {
      console.log(`Erro in STUDENT controller ${err}`);
      res.status(500).json({
        error: true,
        message: response.showMessage(500),
      });
    }
  }

  async create(req = Request, res = Response) {
    const { name, cpf, yearRegistration, phone, mail, cep, street } = req.body;

    const trx = await db.transaction();

    try {
      const [student] = await trx('students')
        .where('cpf', '=', cpf)
        .orWhere('mail', '=', mail);

      if (student) {
        await trx.commit();
        return res.status(422).json({
          error: false,
          message: response.showMessage(404, 'CPF or Mail'),
        });
      }

      let registration = yearRegistration + handleRandomNumber();

      let [existsOrError] = await trx('students').where(
        'registration',
        '=',
        registration,
      );

      if (existsOrError) {
        registration = yearRegistration + handleRandomNumber();
      }

      await trx('students').insert({
        id: uuid(),
        name,
        cpf,
        registration,
        phone,
        mail,
        cep,
        street,
      });

      await trx.commit();
      return res.status(201).send();
    } catch (err) {
      await trx.rollback();
      console.log(`Erro in STUDENT controller ${err}`);
      return res.status(500).json({
        error: true,
        message: response.showMessage(500),
      });
    }
  }

  async update(req = Request, res = Response) {
    const id = req.params.id;
    const data = req.body;

    try {
      if (await db('students').where('id', '=', id).update(data)) {
        res.send();
      } else {
        res.status(404).json({
          error: false,
          message: response.showMessage(404, 'Student'),
        });
      }
    } catch (err) {
      console.log(`Error in STUDENTS controller ${err}`);
      return res.status(500).json({
        error: true,
        message: response.showMessage(500),
      });
    }
  }
}
