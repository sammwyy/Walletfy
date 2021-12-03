import { wallet } from 'nanocurrency-web';
import fetch from 'node-fetch';
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
    const req = await fetch('https://api.nano.to/account/' + address);
    const data = await req.json();
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
