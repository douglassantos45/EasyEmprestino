import { Request, Response } from 'express';
import { uuid } from 'uuidv4';
import db from '../database/connections';
import MessageResponse from '../utils/messagesReponse';
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

  async create(req = Request, res = Response) {
    const { name, cpf, yearRegistration, phone, mail, cep, street } = req.body;

    const trx = await db.transaction();

    try {
      await trx('students').insert({
        id: uuid(),
        name,
        cpf,
        registration: yearRegistration + handleRandomNumber(),
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
