import { ServiceResponse } from 'types/service.response';
import HttpService from './httpService';

class AuthService extends HttpService {
  Controller: string = '';
  constructor() {
    super();
    this.Controller = 'auth';
  }

  async login(data: Record<string, any> = {}): Promise<ServiceResponse> {
    return await this.post<ServiceResponse>(`/login`, data);
  }
}

export default new AuthService();
