import { Router } from 'express';
import KnowledgeAreasController from '../controllers/knowledgeAreas.controllers';
import EmployeeController from '../controllers/employee.controllers';

const routes = Router();

const knowledgeAreasController = new KnowledgeAreasController();
const employeeController = new EmployeeController();

routes.get('/knowledge_areas', knowledgeAreasController.index);
routes.post('/knowledge_areas/:id', knowledgeAreasController.create);

/* Employee Controller */
routes.get('/employees', employeeController.index);
routes.post('/employees', employeeController.create);

export default routes;
