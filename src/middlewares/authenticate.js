import JWT from 'jsonwebtoken';
import { Request, Response, NextFunction } from 'express';

export default (req = Request, res = Response, next = NextFunction) => {
  try {
    const token = req.headers.authorization.split(' ')[1];
    console.log(token);
    const decode = JWT.verify(token, 'secreto');
    req.employee = decode;

    console.log(req.employee);
    next();
  } catch (err) {
    res.status(500).json({
      message: 'Erro na autenticação',
    });
  }
};
