// https://emostov.github.io/kusama-terminal/dist/

import { ApiPromise, WsProvider } from '@polkadot/api';

import { subscribeToBlockHeaders } from './polkadot_api_util';
import { stringToNode, displayCurrentTime } from './utils';

const wsProvider = new WsProvider('wss://kusama-rpc.polkadot.io/');

window.addEventListener('DOMContentLoaded', () => {
  const terminal = document.getElementById('terminal');
  $('#aboutModal').modal('show');
  console.log($('#aboutModal'))

  // const modal = document.getElementById('aboutModal');
  // console.log(modal)
  // console.log(terminal)
  // // setTimeout(() => {
  //   modal.classList.add('show');
  // // }, 5 * 1000);
  // // Create welcome message

  const welcomeMsg = stringToNode(
    `<div> 
      <p>Last login: ${displayCurrentTime()} on ttys003</p>
      <p>Polkadot:~ canary-network<span class='grn'>$</span> display blocks</p>
      <p>Connecting to wss://kusama-rpc.polkadot.io/</p>
    <div/>`,
  );

  terminal.append(welcomeMsg);

  ApiPromise
    .create({ provider: wsProvider })
    .then((api) => {
      subscribeToBlockHeaders(api, terminal);

      // findAuthor(api);
    });
});
