import httpService from '../services/http/http.service';

export class CCUAPI {
  static getCCUList() {
    return httpService.get('/totalccu', {
    });
  }

  static getTimelineCCU() {
    return httpService.get('/timeline_ccu', {
    });
  }

  static getCCUByCustomer(nickname) {
    const searchParams = new URLSearchParams({
      nickname,
    }).toString();
    return httpService.get(`/timeline_ccu_customer?${searchParams}`, {
    });
  }

  static findCCUTimeList(starttime, endtime) {
    const searchParams = new URLSearchParams({
      starttime,
      endtime,
    }).toString();
    return httpService.get(`/timeline_ccu?${searchParams}`, {
    });
  }
}
