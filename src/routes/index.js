import { Router } from 'express';
import KnowledgeAreasController from '../controllers/knowledgeAreas.controllers';

const routes = Router();
const knowledgeAreasController = new KnowledgeAreasController();

routes.get('/knowledge_areas', knowledgeAreasController.index);

export default routes;
