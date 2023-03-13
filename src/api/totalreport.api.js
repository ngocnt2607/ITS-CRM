import httpService from '../services/http/http.service';

export class TotalReportAPI {
  static getTotalReportList() {
    return httpService.get('/totalreportdate', {     
    });
  }
  static findTotalReportList(startdate, enddate) {
    const searchParams = new URLSearchParams({
      startdate,
      enddate,
    }).toString();
    return httpService.get(`/totalreportdate?${searchParams}`, {     
    });
  }
}