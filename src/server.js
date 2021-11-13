import express from 'express';
// eslint-disable-next-line no-unused-vars
import dotenv from 'dotenv/config';

const app = express();

const PORT = process.env.PORT || 8080;

app.get('/', (req, res) => {
  res.send('Ok');
});

app.listen(PORT, () => {
  // eslint-disable-next-line no-console
  console.log('Rodando express ');
});
