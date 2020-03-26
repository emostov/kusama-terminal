// import { ApiPromise, WsProvider } from '@polkadot/api';


import { stringToNode } from './dom_util';

export const headers = {};
export const blocks = [];
export const nodes = [];
export const links = [];

export function subscribeToBlockHeaders(api, terminal) {
  api.rpc.chain.subscribeNewHeads((lastHeader) => {
    headers[lastHeader.number] = lastHeader;

    console.log(lastHeader.toString());

    api.rpc.chain.getBlock(lastHeader.hash, (data) => {
      const { block } = data;
      // console.log(block.toString());
      const strBlockNum = block.header.number.toString();
      // console.log(strBlockNum);

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

      // Create DOM elemnts to add and add to DOM
      if (!blocks.length) {

        const message = stringToNode(`
          <div>
            <p class='c-msg'> &nbsp;&nbsp; <span>></span> &nbsp;Connection succesful.</p>
            <p  class='c-msg'> &nbsp;&nbsp; <span>></span> &nbsp;Blocks incoming.</p>
            <br/>
          </div>
        `);
        // terminal.append(succesus);
        // terminal.append(incoming);
        terminal.append(message);
      }
      const number = stringToNode(`<p>Block number: ${strBlockNum}</p>`);
      const time = stringToNode(`<p>Time stamp: ${secondsTime}</p>`);
      const br = stringToNode('<br/>');
      terminal.append(number);
      terminal.append(time);
      terminal.append(br);


      blocks.push(blockObj);
    });
  });
}


/**
 * Notes:
 * All extrinsics so far seem to not be signed transactions. They share the
 * fact that there nonce is zero, the signer is CaKWz5omakTK7ovp4m3koXrHyHb7NG3Nt7GENHbviByZpKp,
 * and
 * Conclusion: They are inherents and are thus no sig. Still not sure on whoe
 * the signer is.
 */
