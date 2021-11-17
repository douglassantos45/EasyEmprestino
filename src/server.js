/* eslint-disable no-console */
import express from 'express';
// eslint-disable-next-line no-unused-vars

import dotenv from 'dotenv/config';
import routes from './routes';

const app = express();

const PORT = process.env.PORT || 8080;
app.use(express.json());
app.use(routes);

app.listen(PORT, () => {
  console.log('Rodando express ');
});
