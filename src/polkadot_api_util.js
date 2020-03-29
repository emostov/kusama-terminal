import { HeaderExtended } from '@polkadot/api-derive';

import { stringToNode, displayBlock } from './utils';


export const headers = {};
export const blocks = [];
export const nodes = [];
export const links = [];

export function subscribeToBlockHeaders(api, terminal) {
  api.rpc.chain.subscribeNewHeads((lastHeader) => {
    headers[lastHeader.number] = lastHeader;

    console.log(api.query.session.validators((validators) => {

    })

    console.log(`#${lastHeader.number} was authored by ${lastHeader.author}`);

    // Use the hash to fetch the corresponding block
    api.rpc.chain.getBlock(lastHeader.hash, (data) => {
      const { block } = data;
      const strBlockNum = block.header.number.toString();

      // Loop through the blocks extrinsics
      let secondsTime;
      // api.query.authorship.author().then((a) => console.log(a))

      // console.log(block);
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
      // Add signed extrinsic count, total event count
      const blockObj = {
        number: strBlockNum,
        timeStamp: secondsTime,
        productionTime,
        extrinsicCount: block.extrinsics.length,
        hash: lastHeader.hash,
        parentHash: lastHeader.parentHash,
      };
      blocks.push(blockObj);

      // Create success message and add to DOM
      if (blocks.length === 1) {
        const message = stringToNode(`
          <div>
            <p class='c-msg'> &nbsp;&nbsp; <span>></span> &nbsp;Connection succesful.</p>
            <p  class='c-msg'> &nbsp;&nbsp; <span>></span> &nbsp;Blocks incoming.</p>
            <br/>
          </div>
        `);
        terminal.append(message);
      }

      // Add block to terminal node
      displayBlock(blockObj, terminal);
    });
  });
}

export function findAuthor(api) {
  api.rpc.chain.subscribeNewHeads((header) => {
    // console.log(lastHeader.digest);
    // const digestItem = header && header.digest
    //   && header.digest.logs.find(({ type }) => type === 'Seal');
    // // console.log(digestItem);
    // console.log(digestItem.asSeal);

    // let item = header.digest.logs.forEach((log) => console.log(log));
    // console.log(HeaderExtended()) // (.extractAuthor())
    // console.log(new HeaderExtended(header))
    // console.log(api.derive.chain.headerExtended()); 
    console.log('------');

    // const digestItem = header && header.digest
    //   && header.digest.logs.find(({ type }) => type === 'Seal');
  });

};


/**
 * Notes:
 * All extrinsics so far seem to not be signed transactions. They share the
 * fact that there nonce is zero, the signer is CaKWz5omakTK7ovp4m3koXrHyHb7NG3Nt7GENHbviByZpKp,
 * and
 * Conclusion: They are inherents and are thus no sig. Still not sure on whoe
 * the signer is.
 *
 * Trying to find block author:
 *
 * api.rpc.chain.subscribeNewHeads((lastHeader)
 *  lastHeader.author ---> returns undefined
 *
 * looked through logs -> cannot find anything that says it is 'consensus'
 *
 */
