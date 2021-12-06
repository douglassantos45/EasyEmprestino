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
      console.log(`Error in KNOWLEDGE_AREAS controller ${err}`);
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
      const [employee] = await trx('employees').where('id', '=', employeeId);
      if (!employee) {
        await trx.commit();
        return res.status(404).json({
          error: false,
          message: response.showMessage(404, 'Employee'),
        });
      }

      const [knowledgeArea] = await trx('knowledge_areas').where(
        'type',
        '=',
        type,
      );

      if (knowledgeArea) {
        await trx.commit();
        return res.status(422).json({
          error: false,
          message: response.showMessage(422, type),
        });
      }

      await trx('knowledge_areas').insert({
        type,
        employee_id: employeeId,
      });
      await trx.commit();

      return res.status(201).send();
    } catch (err) {
      await trx.rollback();
      console.log(`Erro in KNOWLEDGE_AREAS controller ${err}`);
      return res.status(500).json({
        error: true,
        message: response.showMessage(500),
      });
    }
  }

  async remove(req = Request, res = Response) {
    const id = req.params.id;

    try {
      if (await db('knowledge_areas').where('id', '=', id).del()) {
        res.send();
      } else {
        return res.status(404).json({
          error: false,
          message: response.showMessage(404),
        });
      }
    } catch (err) {
      console.log(`Erro in KNOWLEDGE_AREAS controller ${err}`);
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
      if (await db('knowledge_areas').where('id', '=', id).update(data)) {
        res.send();
      } else {
        res.status(404).json({
          error: false,
          message: response.showMessage(404),
        });
      }
    } catch (err) {
      console.log(`Error in KNOWLEDGE_AREAS controller ${err}`);
      return res.status(500).json({
        error: true,
        message: response.showMessage(500),
      });
    }
  }
}
