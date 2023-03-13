import httpService from '../services/http/http.service';

export class IpTelcoAPI {
  static getIpTelcoList() {
    return httpService.get('/listip_telco', {      
    });
  }

  static createNewIpTelco(body) {
    return httpService.post('/insertip_telcos', {     
      body,
    });
  }

  static updateIpTelco(body) {
    return httpService.post('/updateip_telco', {     
      body,
    });
  }

  static deleteIpTelco(id) {
    return httpService.delete('/deleteip_telcos', {     
      body: { id },
    });
  }
}
