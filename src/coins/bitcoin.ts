import { BIP32API, BIP32Factory } from 'bip32';
import { generateMnemonic, mnemonicToSeed } from 'bip39';
import { Network, networks, payments } from 'bitcoinjs-lib';
import fetch from 'node-fetch';
import * as ecc from 'tiny-secp256k1';

import ICoin from '../coin';
import IWallet from '../wallet';

export default class Bitcoin implements ICoin {
  private readonly bip32: BIP32API;
  private readonly network: Network;

  constructor() {
    this.bip32 = BIP32Factory(ecc);
    this.network = networks.bitcoin;
  }

  getCode() {
    return 'btc';
  }

  getName() {
    return 'bitcoin';
  }

  async getBalance(address: string): Promise<number> {
    const req = await fetch('https://blockchain.info/q/addressbalance/' + address + '?confirmations=3');
    const data = await req.text();
    if (data.includes('error')) {
      return -1;
    }
    return parseInt(data, 10) / 100000000;
  }

  async generateWallet(): Promise<IWallet> {
    const mnemonic = generateMnemonic();
    const seed = await mnemonicToSeed(mnemonic);
    const root = this.bip32.fromSeed(seed, this.network);
    const account = root.derivePath("m/44'/0'/0'/0");
    const node = account.derive(0).derive(0);

    const btcAddress = payments.p2pkh({
      pubkey: node.publicKey,
      network: this.network,
    }).address;

    return {
      coin: this.getCode(),
      address: btcAddress,
      key: node.toWIF(),
      mnemonic,
    };
  }
}
