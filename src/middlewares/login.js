import JWT from 'jsonwebtoken';
import { Request, Response, NextFunction } from 'express';

export default (req = Request, res = Response, next = NextFunction) => {
  try {
    const decode = JWT.verify(req.body.token, 'segredo');
    req.employee = decode;

    console.log(req.employee);
    next();
  } catch (err) {
    res.status(500).json({
      error: err,
      message: 'Erro interno',
    });
  }
};
