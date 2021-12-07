import { wallet } from 'nanocurrency-web';
import axios from 'axios';
import ICoin from '../coin';
import IWallet from '../wallet';

export default class Nano implements ICoin {
  getCode() {
    return 'xno';
  }

  getName() {
    return 'nano';
  }

  async getBalance(address: string): Promise<any> {
    const { data } = await axios('https://api.nano.to/account/' + address);

    if (data.error || !data.balance) {
      return -1;
    }
    return data.balance;
  }

  async generateWallet(): Promise<IWallet> {
    const nanoWallet = wallet.generate();

    return {
      coin: this.getCode(),
      key: nanoWallet.accounts[0].privateKey,
      mnemonic: nanoWallet.mnemonic,
      address: nanoWallet.accounts[0].address,
    };
  }
}
