import httpService from '../services/http/http.service';

export class NumberOwnerAPI {
  static getNumberOwnerList() {
    return httpService.get('/listnumber_owner', {      
    });
  }

  static createNewNumberOwner(body) {
    return httpService.post('/insertnumber_owner', {      
      body,
    });
  }

  static updateNumberOwner(body) {
    return httpService.post('/updatenumber_owner', {     
      body,
    });
  }

  static deleteNumberOwner(id) {
    return httpService.delete('/deletenumber_owner', {      
      body: { id },
    });
  }
}
