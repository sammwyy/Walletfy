import IWallet from './wallet';

export default interface ICoin {
  getCode: () => string;
  getName: () => string;

  generateWallet: (args?: any) => Promise<IWallet>;
  getBalance: (address: string) => Promise<number>;
}
