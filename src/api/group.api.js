import httpService from '../services/http/http.service';

export class GroupAPI {
  static getGroupList() {
    return httpService.get('/listgroup', {
    });
  }

  static createNewGroup(body) {
    return httpService.post('/insertgroup', {
      body,
    });
  }

  static updateGroup(body) {
    return httpService.post('/updategroup', {     
      body,
    });
  }

  static deleteGroup(id) {
    return httpService.delete('/deletegroup', {     
      body: { id },
    });
  }
}
