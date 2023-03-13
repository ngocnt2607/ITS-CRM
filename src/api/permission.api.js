import httpService from '../services/http/http.service';

export class PermissionAPI {
  static getPermissionList() {
    return httpService.get('/listper', {     
    });
  }

  static createNewPermission(body) {
    return httpService.post('/insert_per', {     
      body,
    });
  }

  static updatePermission(body) {
    return httpService.post('/updateper', {     
      body,
    });
  }

  static deletePermission(id) {
    return httpService.delete('/delete_per', {     
      body: { id },
    });
  }
}
