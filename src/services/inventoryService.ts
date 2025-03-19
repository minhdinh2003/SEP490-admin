import HttpService from './httpService';

class InventoryService extends HttpService {
  Controller: string = '';
  constructor() {
    super();
    this.Controller = 'inventory';
  }
}

export default new InventoryService();
