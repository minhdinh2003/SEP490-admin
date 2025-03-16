import HttpService from './httpService';
//x
class InventoryService extends HttpService {
  Controller: string = '';
  constructor() {
    super();
    this.Controller = 'inventory';
  }
}

export default new InventoryService();
