// import { ApiPromise, WsProvider } from '@polkadot/api';

import startGraph from './graph.js'

export const headers = {};
export const blocks = [];
export const nodes = [];
export const links = [];

export function subscribeToBlockHeaders(api) {
  api.rpc.chain.subscribeNewHeads((lastHeader) => {
    headers[lastHeader.number] = lastHeader;

    // console.log(lastHeader.toString());

    api.rpc.chain.getBlock(lastHeader.hash, (data) => {
      const { block } = data;
      console.log(block.toString());
      const strBlockNum = block.header.number.toString();
      console.log(strBlockNum);

      // Loop through the blocks extrinsics
      let secondsTime;
      block.extrinsics.forEach((ex) => {

        // check to see if the extrinsic is an inherent of set time
        if (ex.callIndex.toString() === '2,0') {
          const intTime = parseInt(ex.args.toString(), 10);
          secondsTime = Math.floor(intTime / 1000);
        }

      });

      // Get the previous block data by getting the previous node
      const prevBlock = block[blocks.length - 1];

      // Get the time between the timestamp of the current block and the
      // previous block
      const productionTime = prevBlock && prevBlock.timeStamp
        ? secondsTime - prevBlock.timeStamp : 6;

      // Creat block instance
      const blockObj = {
        number: strBlockNum,
        timeStamp: secondsTime,
        productionTime,
      };

      blocks.push(blockObj);
    });
  });


}

export async function getAddressInfo() {
  return -1;
}

/**
 * Notes:
 * All extrinsics so far seem to not be signed transactions. They share the
 * fact that there nonce is zero, the signer is CaKWz5omakTK7ovp4m3koXrHyHb7NG3Nt7GENHbviByZpKp,
 * and
 * Conclusion: They are inherents and are thus no sig. Still not sure on whoe
 * the signer is.
 */