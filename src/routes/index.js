import { Router } from 'express';
import KnowledgeAreasController from '../controllers/knowledgeAreas.controllers';
import EmployeeController from '../controllers/employee.controllers';
import StudentController from '../controllers/student.controller';
import PublicationController from '../controllers/publications.controllers';
import LendsController from '../controllers/lends.controllers';
import LoginController from '../controllers/login.controllers';

const routes = Router();

const knowledgeAreasController = new KnowledgeAreasController();
const employeeController = new EmployeeController();
const studentController = new StudentController();
const publicationController = new PublicationController();
const leadsController = new LendsController();
const loginController = new LoginController();

/* ROUTES */
routes.get('/knowledge_areas', knowledgeAreasController.index);
routes.post('/knowledge_areas/:id', knowledgeAreasController.create);

/* Employee Controller */
routes.get('/employees', employeeController.index);
routes.post('/employees', employeeController.create);

/* Student Controller */
routes.get('/students', studentController.index);
routes.post('/students', studentController.create);

/* Publication Controller */
routes.get('/publications', publicationController.index);
routes.post('/publications/:id', publicationController.create);

/* Lends Controller */
routes.get('/lends', leadsController.index);
routes.post('/lends/:id', leadsController.create);

/* Login Controller */
routes.post('/login', loginController.post);

export default routes;
