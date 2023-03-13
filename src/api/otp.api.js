import httpService from '../services/http/http.service';

export class OtpAPI {
  static getOTPList() {
    return httpService.get('/list_otp_partner', {     
    });
  }

  static createOTPList(body) {
    return httpService.post('/insert_otp_partner', {  
      body   
    });
  }

  static createOTPTopUp(body) {
    return httpService.post('/topup_partner', {  
      body   
    });
  }

  static updateSMSSenderList(body) {
    return httpService.post('/update_otp_partner', {   
      body  
    });
  }
}