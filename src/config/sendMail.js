import nodemailer from 'nodemailer';

const remetente = nodemailer.createTransport({
  host: '',
  service: '',
  port: 587,
  secure: true,
  auth: {
    user: 'seuemail',
    pass: 'suaSenha',
  },
});

export default remetente;
