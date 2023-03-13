import httpService from '../services/http/http.service';

export class ChangePassAPI {
  static createNewPassword(body) {
    return httpService.post('/change_password', {
      body,
    });
  }
}
