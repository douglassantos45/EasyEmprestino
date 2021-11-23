/* eslint-disable class-methods-use-this */
/* eslint-disable no-unused-expressions */
/* eslint-disable no-sequences */

import remetente from '../config/sendMail';

export default class SendMail {
  send(email) {
    try {
      remetente.sendMail(email);
      console.log('Email enviada com sucesso');
    } catch (error) {
      console.log(`Erro: ${error}`);
      throw new Error('Erro ao enviar email');
    }
  }
}
