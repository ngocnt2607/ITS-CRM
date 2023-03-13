import httpService from '../services/http/http.service';

export class SipTotalAPI {
  static getSipTotalList(startdate, enddate, hotline) {
    const searchParams = new URLSearchParams({
      startdate,
      enddate,
      hotline,
    }).toString();
    return httpService.get(`/cuocsiptotal?${searchParams}`, {
      baseURL: 'https://apireport.leeon.vn',
    });
  }
}
