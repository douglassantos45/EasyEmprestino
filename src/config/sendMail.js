import nodemailer from 'nodemailer';

const remetente = nodemailer.createTransport({
  host: 'smpt.google.com',
  port: 587,
  secure: false,
  auth: {
    user: 'seuemail',
    pass: 'suaSenha',
  },
});

export default remetente;
