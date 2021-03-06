import { Wallet as EthWallet } from 'ethers';
import axios from 'axios';

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
    const { data } = await axios('https://api.ethplorer.io/getAddressInfo/' + address + '?apiKey=freekey');
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
