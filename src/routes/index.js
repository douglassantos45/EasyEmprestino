import { Router } from 'express';
import KnowledgeAreasController from '../controllers/knowledgeAreas.controllers';
import EmployeeController from '../controllers/employee.controllers';
import StudentController from '../controllers/student.controller';

const routes = Router();

const knowledgeAreasController = new KnowledgeAreasController();
const employeeController = new EmployeeController();
const studentController = new StudentController();

/* ROUTES */
routes.get('/knowledge_areas', knowledgeAreasController.index);
routes.post('/knowledge_areas/:id', knowledgeAreasController.create);

/* Employee Controller */
routes.get('/employees', employeeController.index);
routes.post('/employees', employeeController.create);

/* Student Controller */
routes.get('/students', studentController.index);
routes.post('/students', studentController.create);

export default routes;
