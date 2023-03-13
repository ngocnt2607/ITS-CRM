import httpService from '../services/http/http.service';

export class TicketAPI {
  static getTicketList() {
    return httpService.get('/listticket', {      
    });
  }

  // static getTaxcode(nickname) {
  //   const searchParams = new URLSearchParams({nickname}).toString();
  //   return httpService.get(`/select_ticket_taxcode?${searchParams}`, {      
  //   });
  // }

  static getIpCustomer(nickname) {
    const searchParams = new URLSearchParams({nickname}).toString();
    return httpService.get(`/select_ticket_ip?${searchParams}`, {      
    });
  }

  // static getNumber(nickname) {
  //   const searchParams = new URLSearchParams({nickname}).toString();
  //   return httpService.get(`/select_ticket_isdn?${searchParams}`, {      
  //   });
  // }

  static createNewTicket(body) {
    return httpService.post('/insertticket', {     
      body,
    });
  }

  static updateTicket(body) {
    return httpService.post('/updateticket', {     
      body,
    });
  }

  static deleteTicket(id) {
    return httpService.delete('/deleteticket', {     
      body: { id },
    });
  }
}
