import httpService from '../services/http/http.service';

export class AccountAPI {
  static getAccountList() {
    return httpService.get('/listaccount', {
    });
  }

  static createNewAccount(body) {
    return httpService.post('/insertaccount', {
      body,
    });
  }

  static updateAccount(body) {
    return httpService.post('/updateaccount', {
      body,
    });
  }

  static deleteAccount(id) {
    return httpService.delete('/deteleaccount', {
      body: { id },
    });
  }
}
