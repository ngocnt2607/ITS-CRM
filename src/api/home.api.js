import httpService from '../services/http/http.service';

export class HomeAPI {
  static getHomeTop10List() {
    return httpService.get('/top_revenue', {     
    });
  }
}
