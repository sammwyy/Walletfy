import ICoin from './coin';
import IWallet from './wallet';

import Bitcoin from './coins/bitcoin';
import Ethereum from './coins/ethereum';
import LiteCoin from './coins/litecoin';
import Nano from './coins/nano';
import Polkadot from './coins/polkadot';
import ShibaInu from './coins/shiba-inu';

export default class Walletfy {
  private coins: ICoin[];

  constructor() {
    this.coins = [];

    this.coins.push(new Bitcoin());
    this.coins.push(new Ethereum());
    this.coins.push(new LiteCoin());
    this.coins.push(new Nano());
    this.coins.push(new Polkadot());

    // ERC-20 tokens
    this.coins.push(new ShibaInu());
  }
  
  get availableCoins() {
    return this.coins.map((coin) => {
      return {
        code: coin.getCode(),
        name: coin.getName(),
      };
    });
  }

  getCoin(name: string): ICoin | null {
    const lowerName = name.toLowerCase();

    for (const coin of this.coins) {
      if (lowerName === coin.getCode() || lowerName === coin.getName()) {
        return coin;
      }
    }

    return null;
  }

  async getBalance(coinName: string, address: string): Promise<number | null> {
    const coin = this.getCoin(coinName);
    if (coin) {
      return await coin.getBalance(address);
    } else {
      return null;
    }
  }

  async generateWallet(coinName: string): Promise<IWallet | null> {
    const coin = this.getCoin(coinName);
    if (coin) {
      return await coin.generateWallet();
    } else {
      return null;
    }
  }
}
