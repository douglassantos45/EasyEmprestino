import { Request, Response } from 'express';
import { uuid } from 'uuidv4';
import db from '../database/connections';
import MessageResponse from '../utils/messagesReponse';
import handleRandomNumber from '../utils/randomNumber';

const response = new MessageResponse();

export default class EmployeeControllers {
  async index(req = Request, res = Response) {
    try {
      const employees = await db.select().table('employees');

      if (employees.length < 0) {
        return res.status(200).json({
          error: false,
          message: 'Empty employee list.',
          data: employees,
        });
      }
      res.status(200).json({
        error: false,
        data: employees,
      });
    } catch (err) {
      console.log(`Err in EMPLOYEE controller: ${err}`);
      res.status(500).json({
        error: true,
        message: response.showMessage(500),
      });
    }
  }

  async create(req = Request, res = Response) {
    const data = req.body;

    const {
      name,
      cpf,
      rg,
      yearRegistration,
      mail,
      password,
      phone,
      cep,
      street,
      charge,
    } = req.body;

    const trx = await db.transaction();

    try {
      await trx('employees').insert({
        id: uuid(),
        name,
        cpf,
        rg,
        registration: yearRegistration + handleRandomNumber(),
        mail,
        password,
        phone,
        cep,
        street,
        charge,
      });
      await trx.commit();

      return res.status(201).json({
        message: response.showMessage(201, 'Employee'),
      });
    } catch (err) {
      await trx.rollback();

      console.log(`Error in EMPLOYEE controller ${err}`);
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
      if (await db('employees').where('id', '=', id).update(data)) {
        res.send();
      } else {
        res.status(404).json({
          error: false,
          message: response.showMessage(404),
        });
      }
    } catch (err) {
      console.log(`Error in EMPLOYEE controller ${err}`);
      return res.status(500).json({
        error: true,
        message: response.showMessage(500),
      });
    }
  }
}
