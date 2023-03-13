import httpService from '../services/http/http.service';

export class SmsAdvAPI {
  static getSmsAdvList() {
    return httpService.get('/customer_sms_adv', {
      baseURL: 'http://171.244.56.178:8080',
    });
  }

  static getSmsCustomerServiceList() {
    return httpService.get('/customer_service_sms_adv', {
      baseURL: 'http://171.244.56.178:8080',
    });
  }

  static getSmsMessageTemplateList() {
    return httpService.get('/message_template', {
      baseURL: 'http://171.244.56.178:8080',
    });
  }

  static getSmsLogAdvList() {
    return httpService.get('/sms_log', {
      baseURL: 'http://171.244.56.178:8080',
    });
  }

  static createNewSmsAdv(body) {
    return httpService.post('/insert_customer_sms_adv', {
      baseURL: 'http://171.244.56.178:8080',
      body,
    });
  }

  static createNewSmsCustomerService(body) {
    return httpService.post('/insert_customer_service_sms_adv', {
      baseURL: 'http://171.244.56.178:8080',
      body,
    });
  }

  static createNewSmsMessageTemplate(body) {
    return httpService.post('/insert_message_template', {
      baseURL: 'http://171.244.56.178:8080',
      body,
    });
  }

  static createSmsAdvTopUp(body) {
    return httpService.post('/topup_customer_sms_adv', {
      baseURL: 'http://171.244.56.178:8080',
      body,
    });
  }

  static updateSmsAdv(body) {
    return httpService.post('/update_smsadv', {
      baseURL: 'http://171.244.56.178:8080',
      body,
    });
  }

  static updateSmsCustomerService(body) {
    return httpService.post('/update_customerservice', {
      baseURL: 'http://171.244.56.178:8080',
      body,
    });
  }

  static updateSmsMessageTemplate(body) {
    return httpService.post('/update_messagetemplate', {
      baseURL: 'http://171.244.56.178:8080',
      body,
    });
  }

  static deleteSmsMessageTemplate(id) {
    return httpService.delete('/delete_messagetemplate', {
      baseURL: 'http://171.244.56.178:8080',
      body: { id },
    });
  }

  static findSMSLogAdvList(starttime, endtime, sender) {
    const searchParams = new URLSearchParams({
      starttime,
      endtime,
      sender,
    }).toString();
    return httpService.get(`/find_smslog_adv?${searchParams}`, {  
      baseURL: 'http://171.244.56.178:8080',
    });
  }
}
