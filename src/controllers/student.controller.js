import { Request, Response } from 'express';
import db from '../database/connections';
import MessageResponse from '../utils/messagesReponse';

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
    const student = req.body;
    const trx = await db.transaction();

    try {
      await trx('students').insert(student);

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
}
