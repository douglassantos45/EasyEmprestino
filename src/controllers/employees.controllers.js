import { Request, Response } from 'express';
import db from '../database/connections';
import MessageResponse from '../utils/messagesReponse';

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
      console.log(`Err in employee controller: ${err}`);
      res.status(500).json({
        error: true,
        message: response.showMessage(500),
      });
    }
  }

  async create(req = Request, res = Response) {
    const employee = req.body;

    const trx = await db.transaction();

    try {
      await trx('employees').insert(employee);
      await trx.commit();

      return res.status(201).json({
        message: response.showMessage(201, 'Employee'),
      });
    } catch (err) {
      await trx.rollback();

      console.log(`Error in employees controller ${err}`);
      return res.status(500).json({
        error: true,
        message: response.showMessage(500),
      });
    }
  }
}
