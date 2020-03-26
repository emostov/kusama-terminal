import { ApiPromise, WsProvider } from '@polkadot/api';

import { subscribeToBlockHeaders, nodes, links } from '../src/polkadot_api_util';
import './graph.css';
import startGraph from './graph.js'

const wsProvider = new WsProvider('wss://kusama-rpc.polkadot.io/');


window.addEventListener('DOMContentLoaded', (event) => {
  console.log('hiii');

  ApiPromise
    .create({ provider: wsProvider })
    .then((api) => {
      subscribeToBlockHeaders(api);

      // Pass in a json object of the nodes and links
      // const blockNodesAndLinksJSON = JSON.stringify({ nodes, links })
      // startGraph(blockNodesAndLinksJSON);
    });
});

