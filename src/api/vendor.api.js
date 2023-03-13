import httpService from '../services/http/http.service';

export class VendorAPI {
  static getVendorList() {
    return httpService.get('/listvendor', {      
    });
  }

  static createNewVendor(body) {
    return httpService.post('/insertvendor', {     
      body,
    });
  }

  static updateVendor(body) {
    return httpService.post('/updatevendor', {     
      body,
    });
  }

  static deleteVendor(id) {
    return httpService.delete('/deletevendor', {     
      body: { id },
    });
  }
}
