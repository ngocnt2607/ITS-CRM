import httpService from '../services/http/http.service';

export class VbnAPI {
  static getVbnList() {
    return httpService.get('/listbrandnames', {     
    });
  }

  static downloadVbn() {
    return httpService.post('/download_brandname', {     
      responseType: 'blob',
    });
  }

  static createNewVBN(body) {
    return httpService.post('/insertbrandnames', {     
      body,
    });
  }

  static updateVBN(body) {
    return httpService.post('/updatebrandname', {     
      body,
    });
  }

  static deleteVBN(id) {
    return httpService.delete('/deletebrandnames', {     
      body: { id },
    });
  }
}
