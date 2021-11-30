/* eslint-disable arrow-body-style */
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
      console.log(`Error in PUBLICATIONS controller ${err}`);
      res.status(500).json({
        error: true,
        message: response.showMessage(500),
      });
    }
  }

  async create(req = Request, res = Response) {
    const { quotas, title, authors, knowledgeArea } = req.body;
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
      const insertedPublicationsIds = await trx('publications').insert({
        quotas,
        title,
        authors,
        employee_id: employeeId,
      });

      const [publicationId] = insertedPublicationsIds;

      const publicationsKnowledgeAreas = knowledgeArea.map(
        knowledgeAreaItem => {
          return {
            publication_id: publicationId,
            knowledge_area_id: knowledgeAreaItem.id,
          };
        },
      );
      console.log(publicationsKnowledgeAreas);
      await trx('publications_knowledgeAreas').insert(
        publicationsKnowledgeAreas,
      );

      await trx.commit();

      return res.status(201).send();
    } catch (err) {
      await trx.rollback();
      console.log(`Erro in PUBLICATIONS controller ${err}`);
      return res.status(500).json({
        error: true,
        message: response.showMessage(500),
      });
    }
  }

  async remove(req = Request, res = Response) {
    const id = req.params.id;

    try {
      if (await db('publications').where('id', '=', id).del()) {
        res.send();
      } else {
        res.status(404).json({
          error: false,
          message: response.showMessage(404),
        });
      }
    } catch (err) {
      return res.status(500).json({
        error: true,
        message: response.showMessage(500),
      });
    }
  }

  async update(req = Request, res = Response) {
    const id = req.params.id;
    const { quotas, title, authors, knowledgeAreaId } = req.body;

    try {
      if (
        await db('publications').where('id', '=', id).update({
          quotas,
          title,
          authors,
          knowledge_area_id: knowledgeAreaId,
        })
      ) {
        res.send();
      } else {
        res.status(404).json({
          error: false,
          message: response.showMessage(404),
        });
      }
    } catch (err) {
      console.log(`Error in PUBLICATIONS controller ${err}`);
      return res.status(500).json({
        error: true,
        message: response.showMessage(500),
      });
    }
  }
}
