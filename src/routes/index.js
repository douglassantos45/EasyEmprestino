import { Router } from 'express';
import KnowledgeAreasController from '../controllers/knowledgeAreas.controllers';
import EmployeeController from '../controllers/employees.controllers';
import StudentController from '../controllers/student.controller';
import PublicationController from '../controllers/publications.controllers';
import LendsController from '../controllers/lends.controllers';
import LoginController from '../controllers/login.controllers';
import authToken from '../middlewares/authenticate';

const routes = Router();

const knowledgeAreasController = new KnowledgeAreasController();
const employeeController = new EmployeeController();
const studentController = new StudentController();
const publicationController = new PublicationController();
const leadsController = new LendsController();
const loginController = new LoginController();

/* ROUTES */
routes.get('/knowledge_areas', authToken, knowledgeAreasController.index);
routes.post('/knowledge_areas/:id', authToken, knowledgeAreasController.create);

/* Employee Controller */
routes.get('/employees', employeeController.index);
routes.post('/employees', employeeController.create);

/* Student Controller */
routes.get('/students', authToken, studentController.index);
routes.post('/students', authToken, studentController.create);

/* Publication Controller */
routes.get('/publications', authToken, publicationController.index);
routes.post('/publications/:id', authToken, publicationController.create);

/* Lends Controller */
routes.get('/lends', authToken, leadsController.index);
routes.post('/lends/:id', authToken, leadsController.create);

/* Login Controller */
routes.post('/login', loginController.post);

export default routes;
