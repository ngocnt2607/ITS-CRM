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
    return httpService.get('/report_detail', {      
    });
  }

  static downloadReport(body) {
    return httpService.post('/download_report', {
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
