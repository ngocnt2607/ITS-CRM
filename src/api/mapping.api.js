import httpService from '../services/http/http.service';

export class MappingAPI {
  static getListMapping() {
    return httpService.get('/listmaping', {     
    });
  }

  static createNewMapping(body) {
    return httpService.post('/insertmaping', {     
      body,
    });
  }

  static updateMapping(body) {
    return httpService.post('/updatemaping', {     
      body,
    });
  }

  static deleteMapping(id) {
    return httpService.delete('/detelemaping', {     
      body: {id}
    });
  }
}