import httpService from '../services/http/http.service';

export class SpamHotlineAPI {
  static getSpamHotlineList() {
    return httpService.get('/getspamhotline', {
      baseURL: 'http://103.173.154.207:8085/api',
    });
  }

  static createSpamHotline(name, hotline, mota) {
    return httpService.post('/create-spam', {
      baseURL: 'http://103.173.154.207:8085/api',
      body: { name, hotline, mota },
    });
  }

  static deleteSpamHotline(id) {
    return httpService.delete('/delete-spam', {
      baseURL: 'http://103.173.154.207:8085/api',
      body: { id },
    });
  }
}
