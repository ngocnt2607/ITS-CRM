import httpService from '../services/http/http.service';

export class UserListAPI {
  static getUserList() {
    return httpService.get('/list_user');
  }

  static getGroupList() {
    return httpService.get('/listgroup');
  }

  static getAccount(partner) {
    const searchParams = new URLSearchParams({partner}).toString();
    return httpService.get(`/select_account?${searchParams}`, {      
    });
  }


  static createNewUser(body) {
    return httpService.post('/register',{
      body,
    });
  }

  static updateUser(body) {
    return httpService.post('/update_user',{
      body,
    });
  }

  static deleteUser(id) {
    return httpService.delete('/delete_user',{
      body:{ id },
    });
  }
}
