import httpService from '../services/http/http.service';

export class PartnerDetailAPI {
  static getListPartnerDetail() {
    return httpService.get('/listpartnerdetail', {      
    });
  }

  static getListIP() {
    return httpService.get('/listallvos', {     
    });
  }

  static getMapping(ip, telco) {
    const searchParams = new URLSearchParams({ ip, telco }).toString();
    return httpService.get(`/selectmapping?${searchParams}`, {     
    });
  }

  static getPartner() {
    return httpService.get('/listpartner', {     
    });
  }

  static getAccount(ip) {
    const searchParams = new URLSearchParams({ ip }).toString();
    return httpService.get(`/selectaccount?${searchParams}`, {      
    });
  }

  static getRouting(ip, telco) {
    const searchParams = new URLSearchParams({ ip, telco }).toString();
    return httpService.get(`/selectrouting?${searchParams}`, {     
    });
  }

  static getTelco() {
    return httpService.get('/listtelco', {     
    });
  }

  static createNewPartnerDetail(body) {
    return httpService.post('/insertpartnerdetail', {     
      body,
    });
  }

  static updatePartnerDetail(body) {
    return httpService.post('/updatepartnerdetail', {     
      body,
    });
  }

  static deletePartnerDetail(id) {
    return httpService.delete('/deletepartnerdetail', {     
      body: { id },
    });
  }

  static findPartnerDetailList(partner, ip, account) {
    const searchParams = new URLSearchParams({
      partner,
      ip,
      account,
    }).toString();
    return httpService.get(`/find_partnerdetail?${searchParams}`, {     
    });
  }
}
