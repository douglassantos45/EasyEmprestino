/* eslint-disable no-unused-vars */
/* eslint-disable class-methods-use-this */
import JWT from 'jsonwebtoken';
import { Request, Response } from 'express';
import db from '../database/connections';
import MessageResponse from '../utils/messagesReponse';

const response = new MessageResponse();

export default class LoginController {
  async post(req = Request, res = Response) {
    try {
      const { mail, password } = req.body;

      const [employee] = await db('employees').where('mail', '=', mail);

      if (!employee || employee.password !== password) {
        return res.status(401).json({
          message: response.showMessage(401, 'MailOrPss'),
        });
      }

      const token = JWT.sign(
        {
          employee_id: employee.id,
          mail: employee.mail,
        },
        process.env.SECRET_TOKEN,
        {
          expiresIn: '1h',
        },
      );

      res.status(200).json({
        message: 'Successfully authenticated',
        token,
      });
    } catch (err) {
      console.log(`Erro in login ${err}`);
      res.status(500).json({
        error: true,
        message: response.showMessage(500),
      });
    }
  }
}
