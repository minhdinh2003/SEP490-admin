import HttpService from './httpService';

class UserService extends HttpService {
  Controller: string = '';
  constructor() {
    super();
    this.Controller = 'user';
  }
}

export default new UserService();
