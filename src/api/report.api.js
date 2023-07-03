import httpService from '../services/http/http.service';

export class ReportAPI {
  static getReportList() {
    return httpService.get('/report', {});
  }

  static getReportTelcoCallTypeList() {
    return httpService.get('/report_theo_huong', {});
  }

  static getTotalReport() {
    return httpService.get('/totalreport', {});
  }

  static getReportCallType() {
    return httpService.get('/report_calltype', {});
  }

  static getReportLimit() {
    return httpService.get('/list_han_muc', {});
  }

  static getReportDetail(offset) {
    return httpService.get(`/report_detail`, {
      queryParams: {
        offset,
      },
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

  static downloadISDN(body) {
    return httpService.post('/download_isdn_from_m4', {
      body,
      responseType: 'blob',
    });
  }

  static getCallTypeCustomer(nickname) {
    const searchParams = new URLSearchParams({ nickname }).toString();
    return httpService.get(`/list_calltype?${searchParams}`, {});
  }

  static getCallTypeTelco(telco_group) {
    const searchParams = new URLSearchParams({ telco_group }).toString();
    return httpService.get(`/telco_group_to_callType?${searchParams}`, {});
  }

  static getVosIp(nickname) {
    const searchParams = new URLSearchParams({ nickname }).toString();
    return httpService.get(`/list_ip_partnerdetail?${searchParams}`, {});
  }

  static getAccountReport(nickname, vosip) {
    const searchParams = new URLSearchParams({ nickname, vosip }).toString();
    return httpService.get(`/list_acount_partnerdetail?${searchParams}`, {});
  }

  static findReportList(starttime, endtime, nickname, telco) {
    const searchParams = new URLSearchParams({
      starttime,
      endtime,
      nickname,
      telco,
    }).toString();
    return httpService.get(`/findreport?${searchParams}`, {});
  }

  static findReportDetailList({ starttime, endtime, nickname, offset }) {
    return httpService.get(`/find_report_detail`, {
      queryParams: {
        starttime,
        endtime,
        nickname,
        offset,
      },
    });
  }

  static findReportCustomerList(starttime, endtime, nickname, telco) {
    const searchParams = new URLSearchParams({
      starttime,
      endtime,
      nickname,
      telco,
    }).toString();
    return httpService.get(`/findreport_customer?${searchParams}`, {});
  }

  static findReportCallType(starttime, endtime, nickname, callType) {
    const searchParams = new URLSearchParams({
      starttime,
      endtime,
      nickname,
      callType,
    }).toString();
    return httpService.get(`/find_report_calltype?${searchParams}`, {});
  }

  static findReportCallTypeTelco(starttime, endtime, telco_group, callType) {
    const searchParams = new URLSearchParams({
      starttime,
      endtime,
      telco_group,
      callType,
    }).toString();
    return httpService.get(`/find_report_theo_huong?${searchParams}`, {});
  }
}
