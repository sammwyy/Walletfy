import { ApiPromise, WsProvider } from '@polkadot/api';
import { Keyring } from '@polkadot/keyring';
import { KeypairType } from '@polkadot/util-crypto/types';

import ICoin from '../coin';
import IWallet from '../wallet';

export default class Polkadot implements ICoin {
  getCode() {
    return 'dot';
  }

  getName() {
    return 'polkadot';
  }

  async getBalance(address: string): Promise<number> {
    const wsProvider = new WsProvider('wss://rpc.polkadot.io');
    try {
      const api = await ApiPromise.create({ provider: wsProvider });
      const { data: balance } = await api.query.system.account(address);
      return balance.free.toNumber();
    } catch (_) {
      return -1;
    } finally {
      wsProvider.disconnect();
    }
  }

  async generateWallet(type: KeypairType = 'ed25519'): Promise<IWallet> {
    const { mnemonicGenerate } = await import('@polkadot/util-crypto');
    const keyring = new Keyring({ type });
    const mnemonic = mnemonicGenerate();
    const ep = keyring.addFromMnemonic(mnemonic);
    return {
      coin: this.getCode(),
      address: ep.address,
      key: ep.publicKey.toString(),
      mnemonic,
    };
  }
}
