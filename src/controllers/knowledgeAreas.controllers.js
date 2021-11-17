/* eslint-disable no-unused-vars */
/* eslint-disable class-methods-use-this */
import { Request, Response } from 'express';

export default class KnowledgeAreasController {
  async index(req = Request, res = Response) {
    res.send('ok');
  }

  async create(req = Request, res = Response) {
    const data = req.body;

    res.json(data);
  }
}
