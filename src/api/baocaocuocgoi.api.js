import httpService from '../services/http/http.service';

export class BaoCaoAPI {
  static getBaoCaoList() {
    return httpService.get('/baocaocuocgoi', {
    });
  }
}