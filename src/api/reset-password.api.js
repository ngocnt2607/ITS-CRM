import httpService from '../services/http/http.service';

export class ResetAPI {
  static reset(email) {
    return httpService.post('/reset_password', {
      body: {
        email
      },
    });
  }
}
