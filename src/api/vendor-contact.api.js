import httpService from '../services/http/http.service';

export class VendorContactAPI {
  static getVendorContactList() {
    return httpService.get('/listvendor_contact', {      
    });
  }

  static createNewVendorContact(body) {
    return httpService.post('/insertvendor_contact', {     
      body,
    });
  }

  static updateVendorContact(body) {
    return httpService.post('/updatevendor_contact', {     
      body,
    });
  }

  static deleteVendorContact(id) {
    return httpService.delete('/deletevendor_contact', {     
      body: { id },
    });
  }

  static getVendorNameList() {
    return httpService.get('/listvendorname', {      
    });
  }
}
