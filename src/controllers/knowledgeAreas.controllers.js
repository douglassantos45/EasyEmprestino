import { Request, Response } from 'express';
import db from '../database/connections';
import MessageResponse from '../utils/messagesReponse';

const response = new MessageResponse();

export default class KnowledgeAreasControllers {
  async index(req = Request, res = Response) {
    try {
      const knowledgeAreas = await db('knowledge_areas').select([
        'knowledge_areas.id',
        'knowledge_areas.type',
      ]);

      res.status(200).json({
        error: false,
        data: knowledgeAreas,
      });
    } catch (err) {
      console.log(`Error in KNOWLEDGE_AREAS controller ${err}`);
      res.status(500).json({
        error: true,
        message: response.showMessage(500),
      });
    }
  }

  async show(req = Request, res = Response) {
    const { id } = req.params;
    try {
      const knowledgeAreas = await db('knowledge_areas')
        .join('employees', 'knowledge_areas.employee_id', 'employees.id')
        .where('knowledge_areas.id', '=', id)
        .select([
          'knowledge_areas.*',
          'employees.name',
          'employees.registration',
        ]);

      const knowledgeAreasEp = knowledgeAreas.map(knowledgeAreaEp => {
        const response = {
          id: knowledgeAreaEp.id,
          type: knowledgeAreaEp.type,
          employee: {
            name: knowledgeAreaEp.name,
            registration: knowledgeAreaEp.registration,
          },
        };

        return response;
      });

      res.status(200).json({
        error: false,
        data: knowledgeAreasEp,
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
