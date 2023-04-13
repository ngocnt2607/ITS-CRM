import httpService from '../services/http/http.service';

export class InformCdrAPI {
  static getInformCdrList() {
    return httpService.get('/list_invoice', {});
  }

  static getInvoiceDetail(inform_id) {
    return httpService.post('/invoice_detail_bk', {
      body: {
        inform_id
      },
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
