import httpService from '../services/http/http.service';

export class LogAPI {
  static getLogList() {
    return httpService.get('/log', {      
    });
  }

  static findLogList(starttime, endtime, name) {
    const searchParams = new URLSearchParams({
      starttime,
      endtime,
      name,
    }).toString();
    return httpService.get(`/findlog?${searchParams}`, {      
    });
  }
}
