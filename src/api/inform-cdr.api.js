import httpService from '../services/http/http.service';

export class InformCdrAPI {
  static getInformCdrList() {
    return httpService.get('/list_invoice', {      
    });
  }

  static getInformCdrDetailList(body) {
    return httpService.post('/invoice_detail', {  
      body,    
    });
  }

  static createNewInformCdr(body) {
    return httpService.post('/create_invoice', {      
      body,
    });
  }

  static updateInformCdr(body) {
    return httpService.post('/update_invoice', {      
      body,
    });
  }

  static deleteInformCdr(id) {
    return httpService.delete('/delete_invoice', {     
      body: { id },
    });
  }
}
