import axios from 'axios';
import { Wallet as EthWallet } from 'ethers';
import IWallet from '../wallet';

interface TokenInfo {
  name: string;
  symbol: string;
  decimals: number;
  balance: number;
}

export default class Ethplorer {
  private readonly url: string = 'https://api.ethplorer.io/getAddressInfo';

  async getTokenInfo(address: string, symbol: string): Promise<TokenInfo | null> {
    try {
      const { data } = await axios(`${this.url}/${address}?apiKey=freekey`);
      if (!data.tokens) return null;
      const token = data.tokens.find(({ tokenInfo }) => tokenInfo.symbol === symbol.toUpperCase());
      if (!token) return null;
      return {
        ...token.tokenInfo,
        balance: token.rawBalance,
      };
    } catch (_) {
      return null;
    }
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

  getCode(): string {
    throw new Error('Method not implemented.');
  }
}
