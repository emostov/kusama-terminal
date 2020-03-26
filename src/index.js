import { ApiPromise, WsProvider } from '@polkadot/api';

import { subscribeToBlockHeaders } from './polkadot_api_util';


const wsProvider = new WsProvider('wss://kusama-rpc.polkadot.io/');


window.addEventListener('DOMContentLoaded', () => {
  console.log('hiii');

  ApiPromise
    .create({ provider: wsProvider })
    .then((api) => {
      subscribeToBlockHeaders(api);
    });
});
