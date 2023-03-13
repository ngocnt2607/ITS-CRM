import httpService from '../services/http/http.service';

export class AuthenticationAPI {
  static login(user, password) {
    return httpService.post('/dangnhap', {
      body: {
        user,
        password,
      },
    });
  }
}
