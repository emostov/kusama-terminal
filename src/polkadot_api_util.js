import { ApiPromise, WsProvider } from '@polkadot/api';

const wsProvider = new WsProvider('wss://kusama-rpc.polkadot.io/');
const api = await ApiPromise.create({ provider: wsProvider });