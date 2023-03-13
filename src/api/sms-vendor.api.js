import httpService from '../services/http/http.service';

export class SMSVendorAPI {
  static getSMSVendorList() {
    return httpService.get('/report_sms_vendor', {     
    });
  }

  static getSMSVendorTotal() {
    return httpService.get('/top_revenue_vendor', {     
    });
  }

  static getVendorSendorList() {
    return httpService.get('/list_sender', {     
    });
  }

  static getSMSPartnerList() {
    return httpService.get('/report_sms_partner', {     
    });
  }

  static getSMSPartnerTotal() {
    return httpService.get('/top_revenue_partner', {     
    });
  }

  static getSMSBrandList() {
    return httpService.get('/report_sms_brand', {     
    });
  }

  static getSMSBrandTotal() {
    return httpService.get('/top_sms_brand', {     
    });
  }


  static getSMSStatisticList() {
    return httpService.get('/sms_statistical', {     
    });
  }

  static getSMSSenderList() {
    return httpService.get('/vendor_sender', {     
    });
  }

  static createSMSSenderList(body) {
    return httpService.post('/insert_sender_vender', {  
      body   
    });
  }

  static updateSMSSenderList(body) {
    return httpService.post('/update_sender_vender', {   
      body  
    });
  }

  static findSMSVendorList(starttime, endtime, vendor_name) {
    const searchParams = new URLSearchParams({
      starttime,
      endtime,
      vendor_name,
    }).toString();
    return httpService.get(`/find_report_sms_vendor?${searchParams}`, {     
    });
  }

  static findSMSPartnerList(starttime, endtime, partner_name) {
    const searchParams = new URLSearchParams({
      starttime,
      endtime,
      partner_name,
    }).toString();
    return httpService.get(`/find_report_sms_partner?${searchParams}`, {     
    });
  }

  static findSMSBrandList(starttime, endtime, sender_name) {
    const searchParams = new URLSearchParams({
      starttime,
      endtime,
      sender_name,
    }).toString();
    return httpService.get(`/find_report_sms_brand?${searchParams}`, {     
    });
  }

  static findSMSVendorSenderList(starttime, endtime, sender_name, TYPES) {
    const searchParams = new URLSearchParams({
      starttime,
      endtime,
      sender_name,
      TYPES
    }).toString();
    return httpService.get(`/find_sender_vender?${searchParams}`, {     
    });
  }

  static findSMSStatisticList(start_time, end_time, sender, mobile, message) {
    const searchParams = new URLSearchParams({
      start_time,
      end_time,
      sender,
      mobile,
      message,
    }).toString();
    return httpService.get(`/find_sms_statistical?${searchParams}`, {     
    });
  }
}