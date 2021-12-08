import { BIP32API, BIP32Factory } from 'bip32';
import { generateMnemonic, mnemonicToSeed } from 'bip39';
import { Network, payments } from 'bitcoinjs-lib';
import * as ecc from 'tiny-secp256k1';
import axios from 'axios';

import ICoin from "../coin";
import IWallet from '../wallet';

export default class Sumcoin implements ICoin {
  private readonly bip32: BIP32API;
  private readonly network: Network;

  constructor() {
    this.bip32 = BIP32Factory(ecc);
    this.network = {
      messagePrefix: '\u0019Sumcoin Signed Message:\n',
      bech32: 'sum',
      bip32: {
        public: 0x0488abe6,
        private: 0x0488b41c
      },
      pubKeyHash: 0x3f,
      scriptHash: 0xc8,
      wif: 0xbf
    };
  }

  getCode() {
    return 'sum';
  }

  getName() {
    return 'sumcoin';
  }

  async getBalance(address: string): Promise<number> {
    try {
      const { data } = await axios('https://insight.sumcore.org/api/addr/' + address);
      return data.balance;
    } catch (err) {
      return -1;
    }
  }

  async generateWallet(): Promise<IWallet> {
    const mnemonic = generateMnemonic();
    const seed = await mnemonicToSeed(mnemonic);
    const root = this.bip32.fromSeed(seed, this.network);
    const account = root.derivePath("m/44'/552'/0'/0");
    const node = account.derive(0).derive(0);

    const sumAddress = payments.p2pkh({
      pubkey: node.publicKey,
      network: this.network,
    }).address;

    return {
      coin: this.getCode(),
      address: sumAddress,
      key: node.toWIF(),
      mnemonic,
    };
  }
}