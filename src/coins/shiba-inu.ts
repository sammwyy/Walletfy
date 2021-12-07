import { Wallet as EthWallet } from 'ethers';
import fetch from 'node-fetch';

import ICoin from '../coin';
import IWallet from '../wallet';

export default class ShibaInu implements ICoin {
  getCode() {
    return 'shib';
  }

  getName() {
    return 'shiba-inu';
  }

  async getBalance(address: string): Promise<number> {
    const req = await fetch('https://api.ethplorer.io/getAddressInfo/' + address + '?apiKey=freekey');
    const data = await req.json();
    const tokenList = data.tokens || [];
    const token = tokenList.find((token) => token.tokenInfo.symbol === this.getCode().toUpperCase());
    if (!token) return -1;
    return token.rawBalance / Math.pow(10, token.tokenInfo.decimals);
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
