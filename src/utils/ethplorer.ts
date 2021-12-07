import axios from 'axios';

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
}
