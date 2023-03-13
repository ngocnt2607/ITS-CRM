import httpService from '../services/http/http.service';

export class RoutingAPI {
  static getRoutingList() {
    return httpService.get('/listrouting', {     
    });
  }

  static createNewRouting(body) {
    return httpService.post('/insertrouting', {     
      body,
    });
  }

  static updateRouting(body) {
    return httpService.post('/updaterouting', {     
      body,
    });
  }

  static deleteRouting(id) {
    return httpService.delete('/deleterouting', {     
      body: { id },
    });
  }
}
