/* eslint-disable arrow-body-style */
import { Request, Response } from 'express';
import db from '../database/connections';
import MessageResponse from '../utils/messagesReponse';

const response = new MessageResponse();

export default class PublicationController {
  async index(req = Request, res = Response) {
    try {
      const publications = await db('publications');

      publications.map(publication => delete publication.employee_id);

      return res.status(200).json({
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

  async show(req = Request, res = Response) {
    const { id } = req.params;
    try {
      const [publication] = await db('publications').where('id', '=', id);

      if (!publication) {
        return res.status(404).json({
          error: false,
          message: response.showMessage(404, 'Publication'),
        });
      }

      const knowledgeAreas = await db('publications_knowledgeAreas')
        .join(
          'publications',
          'publications_knowledgeAreas.publication_id',
          'publications.id',
        )
        .join(
          'knowledge_areas',
          'publications_knowledgeAreas.knowledge_area_id',
          'knowledge_areas.id',
        )
        .select(['knowledge_areas.type']);

      const pub = {
        id: publication.id,
        title: publication.title,
        authors: publication.authors,
        quotas: publication.quotas,
        knowledge_areas: knowledgeAreas,
      };

      return res.status(200).json(pub);
    } catch (err) {
      console.log(`Erro in PUBLICATIONS controller ${err}`);
      return res.status(500).json({
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
