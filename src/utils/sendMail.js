/* eslint-disable class-methods-use-this */
/* eslint-disable no-unused-expressions */
/* eslint-disable no-sequences */

import remetente from '../config/sendMail';

export default class SendMail {
  async send(email) {
    await remetente
      .sendMail(email)
      .then(response => {
        console.log(response);
        console.log('Email enviada com sucesso!');
      })
      .catch(error => {
        console.log(error);
        console.log('Erro ao enviar a mensagem!');
      });
  }
}
