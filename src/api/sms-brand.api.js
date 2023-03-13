import httpService from '../services/http/http.service';

export class SmsBrandAPI {
  static getSmsBrandList() {
    return httpService.get('/customer_sms_brandname', {
    });
  }

  static getSmsBrandCustomerServiceList() {
    return httpService.get('/customer_service_sms_brand', {
    });
  }

  static getSmsBrandTelcoList() {
    return httpService.get('/get_telco_brand', {
    });
  }

  static getSmsBrandMessageTemplateList() {
    return httpService.get('/message_template_brand', {     
    });
  }

  static getSmsLogBrandList() {
    return httpService.get('/sms_log_brand', {     
    });
  }

  static createNewSmsBrand(body) {
    return httpService.post('/insert_customer_sms_brandname', {
      body,
    });
  }

  static createNewSmsBrandCustomerService(body) {
    return httpService.post('/insert_customer_service_smsbrand', {
      body,
    });
  }

  static createNewSmsBrandMessageTemplate(body) {
    return httpService.post('/insert_message_template_brand', {
      body,
    });
  }

  static createSmsBrandTopUp(body) {
    return httpService.post('/topup_customer_sms_brandname', {
      body,
    });
  }

  static updateSmsBrand(body) {
    return httpService.post('/updatesmsbrand', {
      body,
    });
  }

  static updateSmsBrandCustomerService(body) {
    return httpService.post('/update_customerservice_brand', {
      body,
    });
  }

  static updateSmsBrandMessageTemplate(body) {
    return httpService.post('/update_messagetemplate_brand', {
      body,
    });
  }

  static deleteSmsBrandMessageTemplate(id) {
    return httpService.delete('/delete_messagetemplate_brand', {
      body: { id },
    });
  }

  static findSMSLogBrandList(starttime, endtime, status, isdn) {
    const searchParams = new URLSearchParams({
      starttime,
      endtime,
      status,
      isdn,
    }).toString();
    return httpService.get(`/find_smslog_brand?${searchParams}`, {  
    });
  }
}
