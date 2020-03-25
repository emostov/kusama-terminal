import { ApiPromise, WsProvider } from '@polkadot/api';

import { subscribeToBlockHeaders, headers, blocks } from '../src/polkadot_api_util';

const wsProvider = new WsProvider('wss://kusama-rpc.polkadot.io/');


window.addEventListener('DOMContentLoaded', (event) => {
  console.log('hiii');

  ApiPromise
    .create({ provider: wsProvider })
    .then((api) => {
      subscribeToBlockHeaders(api);
      // console.log(headers);
    });
});