import { Request, Response } from 'express';
import db from '../database/connections';
import MessageResponse from '../utils/messagesReponse';

const response = new MessageResponse();

export default class PublicationController {
  async index(req = Request, res = Response) {
    try {
      const publications = await db.select().from().table('publications');

      res.status(200).json({
        error: false,
        data: publications,
      });
    } catch (err) {
      console.log(`Error in publications controller ${err}`);
      res.status(500).json({
        error: true,
        message: response.showMessage(500),
      });
    }
  }

  async create(req = Request, res = Response) {
    const { quota, title, authors, knowledgeAreaId } = req.body;
    const employeeId = req.params.id;
    const trx = await db.transaction();

    try {
      await trx('publications').insert({
        quota,
        title,
        authors,
        employee_id: employeeId,
        knowledge_area_id: knowledgeAreaId,
      });

      await trx.commit();

      return res.status(201).send();
    } catch (err) {
      await trx.rollback();
      console.log(`Erro in CREATE publications controller ${err}`);
      return res.status(500).json({
        error: true,
        message: response.showMessage(500),
      });
    }
  }
}
