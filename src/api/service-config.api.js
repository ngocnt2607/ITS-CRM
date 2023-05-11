import httpService from '../services/http/http.service';

export class ServiceConfigAPI {
  static getServiceConfigList() {
    return httpService.get('/service_config_list', {
    });
  }

  static getServiceTypeList() {
    return httpService.get('/service_type_list', {
    });
  }

  static getServicePacketList() {
    return httpService.get('/service_packet', {
    });
  }

  static createNewServiceConfig(body) {
    return httpService.post('/insert_service_config', {
      body,
    });
  }

  static createNewServicePacket(body) {
    return httpService.post('/insert_service_packet', {
      body,
    });
  }

  static deleteServiceConfig(id) {
    return httpService.delete('/delete_service_config', {     
      body: { id },
    });
  }

  static deleteServicePacket(id) {
    return httpService.delete('/delete_service_packet', {     
      body: { id },
    });
  }

  static updateServiceConfig(body) {
    return httpService.post('/update_service_config', {
      body,
    });
  }

  static updateServicePacket(body) {
    return httpService.post('/update_service_packet', {
      body,
    });
  }

  static findServiceConfigList(nickname, packetName, callType, isBrand) {
    const searchParams = new URLSearchParams({
      nickname,
      packetName,
      callType,
      isBrand,
    }).toString();
    return httpService.get(`/find_service_config?${searchParams}`, {  
    });
  }

}
