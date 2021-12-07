import { Wallet as EthWallet } from 'ethers';
import Ethplorer from '../utils/ethplorer';

import ICoin from '../coin';
import IWallet from '../wallet';

export default class BasicAttentionToken extends Ethplorer implements ICoin {
  getCode() {
    return 'bat';
  }

  getName() {
    return 'basic-attention-token';
  }

  async getBalance(address: string): Promise<number> {
    const token = await this.getTokenInfo(address, this.getCode());
    if (!token) return -1;
    return token.balance / Math.pow(10, token.decimals);
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
