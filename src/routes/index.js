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
routes.get('/knowledge_areas', /* authToken, */ knowledgeAreasController.index);
routes.get(
  '/knowledge_areas/:id',
  /* authToken, */ knowledgeAreasController.show,
);
routes.post(
  '/knowledge_areas/:id',
  /* authToken, */ knowledgeAreasController.create,
);
routes.delete(
  '/knowledge_areas/:id',
  /* authToken, */
  knowledgeAreasController.remove,
);
routes.put(
  '/knowledge_areas/:id',
  /* authToken, */ knowledgeAreasController.update,
);

/* Employee Controller */
routes.get('/employees', employeeController.index);
routes.get('/employees/:id', employeeController.show);
routes.post('/employees', employeeController.create);
routes.put('/employees/:id', employeeController.update);

/* Student Controller */
routes.get('/students', /* authToken, */ studentController.index);
routes.get('/students/:id', /* authToken, */ studentController.show);
routes.post('/students', /* authToken, */ studentController.create);
routes.put('/students/:id', /* authToken, */ studentController.update);

/* Publication Controller */
routes.get('/publications', /* authToken, */ publicationController.index);
routes.get('/publications/:id', /* authToken, */ publicationController.show);
routes.post('/publications/:id', /* authToken, */ publicationController.create);
routes.delete(
  '/publications/:id',
  /* authToken, */ publicationController.remove,
);
routes.put('/publications/:id', /* authToken, */ publicationController.update);

/* Lends Controller */
routes.get('/lends', /* authToken, */ leadsController.index);
routes.post('/lends/:id', /* authToken, */ leadsController.create);
routes.delete('/lends/:id', /* authToken, */ leadsController.create);
routes.put('/lends/:id', /* authToken, */ leadsController.update);

/* Login Controller */
routes.post('/login', loginController.post);

export default routes;
