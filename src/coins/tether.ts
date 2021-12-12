import Ethplorer from '../utils/ethplorer';
import ICoin from '../coin';

export default class Tether extends Ethplorer implements ICoin {
  getCode() {
    return 'usdt';
  }

  getName() {
    return 'tether';
  }

  async getBalance(address: string): Promise<number> {
    const token = await this.getTokenInfo(address, this.getCode());
    if (!token) return -1;
    return token.balance / Math.pow(10, token.decimals);
  }
}
