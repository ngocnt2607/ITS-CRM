import httpService from '../services/http/http.service';

export class ContactAPI {
  static getContactList() {
    return httpService.get('/listcontact');
  }

  static createNewContact(body) {
    return httpService.post('/insertcontact', {
      body,
    });
  }

  static updateContact(body) {
    return httpService.post('/updatecontact', {
      body,
    });
  }

  static deleteContact(id) {
    return httpService.delete('/deletecontact', {

      body: { id },
    });
  }
}
