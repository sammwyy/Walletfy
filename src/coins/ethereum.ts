import { Wallet as EthWallet } from 'ethers';
import fetch from 'node-fetch';

import ICoin from '../coin';
import IWallet from '../wallet';

export default class Ethereum implements ICoin {
  getCode() {
    return 'eth';
  }

  getName() {
    return 'ethereum';
  }

  async getBalance(address: string): Promise<number> {
    const req = await fetch('https://api.ethplorer.io/getAddressInfo/' + address + '?apiKey=freekey');
    const data = await req.json();
    const balance = data.ETH?.balance ?? -1;
    return balance;
  }

  async generateWallet(): Promise<IWallet> {
    const wallet = EthWallet.createRandom();
    return {
      coin: this.getCode(),
      key: wallet.privateKey,
      address: wallet.address,
      mnemonic: wallet.mnemonic.phrase,
    };
  }
}
