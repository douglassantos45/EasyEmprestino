import { Request, Response } from 'express';
import db from '../database/connections';
import MessageResponse from '../utils/messagesReponse';

const response = new MessageResponse();

export default class KnowledgeAreasControllers {
  async index(req = Request, res = Response) {
    try {
      const knowledge_areas = await db.select().from().table('knowledge_areas');

      res.status(200).json({
        error: false,
        data: knowledge_areas,
      });
    } catch (err) {
      console.log(`Error in knowledge_areas_controller ${err}`);
      res.status(500).json({
        error: true,
        message: response.showMessage(500),
      });
    }
  }

  async create(req = Request, res = Response) {
    const { type } = req.body;
    const employeeId = req.params.id;

    const trx = await db.transaction();

    try {
      await trx('knowledge_areas').insert({
        type,
        employee_id: employeeId,
      });
      await trx.commit();

      return res.status(201).send();
    } catch (err) {
      await trx.rollback();
      console.log(`Erro in knowledge_areas_controller ${err}`);
      return res.status(500).json({
        error: true,
        message: response.showMessage(500),
      });
    }
  }
}
