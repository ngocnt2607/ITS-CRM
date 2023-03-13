import httpService from '../services/http/http.service';

export class ContractAPI {
  static getContractList() {
    return httpService.get('/listcontracts', {
    });
  }

  static getServiceList() {
    return httpService.get('/listservice', {
    });
  }

  static getContractNoList() {
    return httpService.get('/listhopdong', {
    });
  }

  static createNewContract(body) {
    return httpService.post('/insertcontracts', {
      body,
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  }

  static createNewContractAppendix(body) {
    return httpService.post('/insertcontract_append', {
      body,
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  }

  static updateContract(body) {
    return httpService.post('/updatecontract', {
      body,
    });
  }

  static updateContractAppendix(body) {
    return httpService.post('/updatecontract', {
      body,
    });
  }

  static deleteContract(id) {
    return httpService.delete('/deletecontracts', {
      body: { id },
    });
  }

  static downloadPdfFile(name) {
    return httpService.post('/download_contract_file', {
      body: { name },
      responseType: 'blob',
    });
  }
}
