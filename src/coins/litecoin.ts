import { BIP32API, BIP32Factory } from 'bip32';
import { generateMnemonic, mnemonicToSeed } from 'bip39';
import { Network, payments } from 'bitcoinjs-lib';
import fetch from 'node-fetch';
import * as ecc from 'tiny-secp256k1';

import ICoin from '../coin';
import IWallet from '../wallet';

export default class LiteCoin implements ICoin {
  private readonly network: Network;
  private readonly bip32: BIP32API;

  constructor() {
    this.bip32 = BIP32Factory(ecc);
    this.network = {
      messagePrefix: '\x19Litecoin Signed Message:\n',
      bech32: 'ltc',
      bip32: {
        public: 0x019da462,
        private: 0x019d9cfe,
      },
      pubKeyHash: 0x30,
      scriptHash: 0x32,
      wif: 0xb0,
    };
  }

  getCode() {
    return 'ltc';
  }

  getName() {
    return 'litecoin';
  }

  async getBalance(address: string): Promise<number> {
    const req = await fetch('https://api.blockcypher.com/v1/ltc/main/addrs/' + address + '/balance');
    const data = await req.json();
    if (data.balance) {
      return data.balance / 100000000;
    } else {
      return -1;
    }
  }

  async generateWallet(): Promise<IWallet> {
    const mnemonic = generateMnemonic();
    const seed = await mnemonicToSeed(mnemonic);
    const root = this.bip32.fromSeed(seed, this.network);
    const account = root.derivePath("m/44'/0'/0'/0");
    const node = account.derive(0).derive(0);

    const ltcAddress = payments.p2pkh({
      pubkey: node.publicKey,
      network: this.network,
    }).address;

    return {
      coin: this.getCode(),
      address: ltcAddress,
      key: node.toWIF(),
      mnemonic,
    };
  }
}
