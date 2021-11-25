/* eslint-disable no-unused-vars */
/* eslint-disable class-methods-use-this */
import JWT from 'jsonwebtoken';
import { Request, Response } from 'express';
import db from '../database/connections';

export default class LoginController {
  async post(req = Request, res = Response) {
    try {
      const { email, senha } = req.body;

      const [data] = await db('employee').where('email', '=', email);

      if (!data || data.cpf !== senha) {
        return res.status(401).json({
          message: 'Usuário ou senha inválidos',
        });
      }

      const token = JWT.sign(
        {
          id_employee: data.id,
          email: data.email,
        },
        'secreto',
        {
          expiresIn: '1h',
        },
      );

      res.status(200).json({
        message: 'Autenticado com sucesso',
        token,
      });
    } catch (err) {
      console.log(`Erro no login ${err}`);
      res.status(500).json({
        error: err,
        message: 'Erro não esperado.',
      });
    }
  }
}
