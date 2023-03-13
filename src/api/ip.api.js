import httpService from '../services/http/http.service';

export class IpAPI {
  static getIpList() {
    return httpService.get('/listip', {      
    });
  }

  static createNewIp(body) {
    return httpService.post('/inserip', {     
      body,
    });
  }

  static updateIp(body) {
    return httpService.post('/updateip', {     
      body,
    });
  }

  static deleteIp(id) {
    return httpService.delete('/deteleip', {     
      body: { id },
    });
  }
}
