/* eslint-disable class-methods-use-this */
import { Request, Response } from 'express';

export default class EmployeeController {
  async index(req = Request, res = Response) {
    res.send('employee controller.');
  }

  async create(req = Request, res = Response) {
    res.send('ok');
  }
}
