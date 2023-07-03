import httpService from '../services/http/http.service';

export class NumberMemberAPI {
  static getNumberMemberList() {
    return httpService.get('/listnumber_member', {
    });
  }

  static downloadNumberMemer(body) {
    return httpService.post('/downloadnumber_member', {
      body,
      responseType: 'blob',
    });
  }

  static createNewNumberMember(body) {
    return httpService.post('/insertnumber_member', {
      body,
    });
  }

  static updateNumberMember(body) {
    return httpService.post('/updatenumber_member', {
      body,
    });
  }

  static deleteNumberMember(id) {
    return httpService.delete('/deletenumber_member', {
      body: { id },
    });
  }

  static getNumberList() {
    return httpService.get('/listnumber_ownerisdn', {
    });
  }

  static getAllCustomerList() {
    return httpService.get('/listallcustomer', {
    });
  }

  static getMappingPartner(nickname) {
    const searchParams = new URLSearchParams({ nickname }).toString();
    return httpService.get(`/get_m4_from_partner?${searchParams}`, {});
  }

  static findNumberList(isdn, partnerid, telcoid, status) {
    const searchParams = new URLSearchParams({
      isdn,
      partnerid,
      telcoid,
      status,
    }).toString();
    return httpService.get(`/find_number_member?${searchParams}`, {
    });
  }

  static findISDN(mapping) {
    const searchParams = new URLSearchParams({
      mapping,
    }).toString();
    return httpService.get(`/get_isdn_from_m4?${searchParams}`, {});
  }
}
