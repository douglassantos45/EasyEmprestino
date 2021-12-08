/* eslint-disable arrow-body-style */
import { Request, Response } from 'express';
import db from '../database/connections';
import MessageResponse from '../utils/messagesReponse';

const response = new MessageResponse();

export default class PublicationController {
  async index(req = Request, res = Response) {
    try {
      const publications = await db('publications');

      const authors = await db('publications_authors')
        .join(
          'publications',
          'publications_authors.publication_id',
          'publications.id',
        )
        .join('authors', 'publications_authors.author_id', 'authors.id')
        .select(['publications.id', 'authors.name']);

      const pbCompanys = await db('publications_publishingCompany')
        .join(
          'publications',
          'publications_publishingCompany.publication_id',
          'publications.id',
        )
        .join(
          'publishing_company',
          'publications_publishingCompany.pb_company_id',
          'publishing_company.id',
        )
        .select(['publications.id', 'publishing_company.name']);

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
        .select(['publications.id', 'knowledge_areas.type']);

      const pb = publications.map(publication => {
        const knowledgeArea = knowledgeAreas.filter(value => {
          if (value.id === publication.id) {
            const type = value.type;
            return type;
          }
        });
        const author = authors.filter(value => {
          if (value.id === publication.id) {
            const name = value.name;
            return name;
          }
        });
        const pbCompany = pbCompanys.filter(value => {
          if (value.id === publication.id) {
            const name = value.name;
            return name;
          }
        });

        return {
          id: publication.id,
          quota: publication.quota,
          title: publication.title,
          authors: author.map(res => res.name),
          publishingCompany: pbCompany.map(res => res.name),
          knowledgeAreas: knowledgeArea.map(res => res.type),
        };
      });

      return res.status(200).json({
        error: false,
        data: pb,
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
        .where('publication_id', '=', id)
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
        knowledgeAreas,
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
    const { quotas, title, authors, pbCompanyId, knowledgeAreas } = req.body;
    const employeeId = req.params.id;
    const trx = await db.transaction();

    try {
      const [employee] = await trx('employees').where('id', '=', employeeId);
      if (!employee) {
        await trx.rollback();
        return res.status(404).json({
          error: false,
          message: response.showMessage(404, 'Employee'),
        });
      }
      const [publication] = await trx('publications')
        .where('title', '=', title)
        .orWhere('quotas', '=', quotas);

      if (publication) {
        await trx.rollback();
        return res.status(422).json({
          error: false,
          message: response.showMessage(422, title),
        });
      }
      const insertedPublicationsIds = await trx('publications').insert({
        quotas,
        title,
        employee_id: employeeId,
      });

      const [publicationId] = insertedPublicationsIds;

      const publicationsKnowledgeAreas = knowledgeAreas.map(
        knowledgeAreaItem => {
          return {
            publication_id: publicationId,
            knowledge_area_id: knowledgeAreaItem.id,
          };
        },
      );

      const publicationsAuthors = authors.map(author => {
        return {
          publication_id: publicationId,
          author_id: author.id,
        };
      });

      await trx('publications_authors').insert(publicationsAuthors);
      await trx('publications_publishingCompany').insert({
        publication_id: publicationId,
        pb_company_id: pbCompanyId,
      });
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
