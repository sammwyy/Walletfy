import IWallet from './wallet';

export default interface ICoin {
  getCode: () => string;
  getName: () => string;

  generateWallet: () => Promise<IWallet>;
  getBalance: (address: string) => Promise<number>;
}
