import HttpService from './httpService';

class InventoryHistoryService extends HttpService {
  Controller: string = '';
  constructor() {
    super();
    this.Controller = 'inventoryHistory';
  }
}

export default new InventoryHistoryService();
