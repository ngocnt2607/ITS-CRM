import httpService from '../services/http/http.service';

export class ReportAPI {
  static getReportList() {
    return httpService.get('/report', {     
    });
  }

  static getTotalReport() {
    return httpService.get('/totalreport', {      
    });
  }

  static getReportDetail() {
    const currentPage = 2
    return httpService.get(`/report_detail?offset=${currentPage}`, {      
    });
  }

  static downloadReport(body) {
    return httpService.post('/download_report', {
      body,     
      responseType: 'blob',
    });
  }

  static downloadReportDetail(body) {
    return httpService.post('/download_report_detail', {
      body,     
      responseType: 'blob',
    });
  }

  static getVosIp(nickname) {
    const searchParams = new URLSearchParams({ nickname }).toString();
    return httpService.get(`/list_ip_partnerdetail?${searchParams}`, {      
    });
  }

  static getAccountReport(nickname, vosip) {
    const searchParams = new URLSearchParams({ nickname, vosip  }).toString();
    return httpService.get(`/list_acount_partnerdetail?${searchParams}`, {      
    });
  }

  static findReportList(starttime, endtime, nickname, telco) {
    const searchParams = new URLSearchParams({
      starttime,
      endtime,
      nickname,
      telco,
    }).toString();
    return httpService.get(`/findreport?${searchParams}`, {     
    });
  }

  static findReportDetailList(starttime, endtime, nickname) {
    const searchParams = new URLSearchParams({
      starttime,
      endtime,
      nickname,
    }).toString();
    return httpService.get(`/find_report_detail?${searchParams}`, {     
    });
  }

  static findReportCustomerList(starttime, endtime, nickname, telco) {
    const searchParams = new URLSearchParams({
      starttime,
      endtime,
      nickname,
      telco,
    }).toString();
    return httpService.get(`/findreport_customer?${searchParams}`, {     
    });
  }
}
