export default class MessageResponse {
  showMessage(status = undefined, string = 'Data') {
    let message = '';

    switch (status) {
      case 201:
        message = `${string} registered successfully.`;
        break;
      case 204:
        message = string;
        break;
      case 401:
        string
          ? (message = `Username or password is invalid.`)
          : (message = 'Unauthenticated.');
        break;
      case 404:
        string
          ? (message = `Invalid ${string}.`)
          : (message = `Data not found.`);
        break;
      case 500:
        message =
          'An unexpected problem has occurred: An unexpected problem has occurred in the system.';
        break;
      default:
        message = 'An unexpected problem has occurred in the system.';
        break;
    }

    return message;
  }
}
