import httpService from '../services/http/http.service';

export class VendorPackageAPI {
  static getVendorPackageList() {
    return httpService.get('/listvendor_package', {      
    });
  }

  static createNewVendorPackage(body) {
    return httpService.post('/insertvendor_package', {     
      body,
    });
  }

  static updateVendorPackage(body) {
    return httpService.post('/updatevendor_package', {     
      body,
    });
  }

  static deleteVendorPackage(id) {
    return httpService.delete('/deletevendor_package', {     
      body: { id },
    });
  }
}
