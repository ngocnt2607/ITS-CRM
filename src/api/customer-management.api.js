import httpService from '../services/http/http.service';

export class PartnerAPI {
  static getListPartner() {
    return httpService.get('/listpartner', {
    });
  }

  static getListAccountByPartner() {
    return httpService.get('/listidpartnerdetail', {
    });
  }

  static getListVosByPartner() {
    return httpService.get('/listippartnerdetail', {
    });
  }

  static createNewPartner(body) {
    return httpService.post('/insertpartner', {
      body,
    });
  }

  static updatePartner(body) {
    return httpService.post('/updatepartner', {
      body,
    });
  }

  static deletePartner(id) {
    return httpService.delete('/deletepartner', {
      body: { id },
    });
  }
}
