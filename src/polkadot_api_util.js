import { HeaderExtended } from '@polkadot/api-derive';

import { stringToNode, displayBlock, successMessage } from './utils';


export const headers = {};
export const blocks = [];
export const nodes = [];
export const links = [];

function getTimeInSeconds(block) {
  let secondsTime;
  // Loop through the blocks extrinsics
  block.extrinsics.forEach((ex) => {
    // check to see if the extrinsic is an inherent of set time
    if (ex.callIndex.toString() === '2,0') {
      const intTime = parseInt(ex.args.toString(), 10);
      secondsTime = Math.floor(intTime / 1000);
    }
  });
  return secondsTime;
}

function findAuthor(header, validators) {
  const entity = header.digest.logs.find((log) => log.isPreRuntime);
  const [engine, data] = entity.asPreRuntime;
  const author = engine.extractAuthor(data, validators);
  return author.toString();
}

export function subscribeToBlockHeaders(api, terminal) {
  api.query.session.validators()
    .then((validators) => {
      api.rpc.chain.subscribeNewHeads((lastHeader) => {
        headers[lastHeader.number] = lastHeader;
        const author = findAuthor(lastHeader, validators);
        // Use the hash to fetch the corresponding block
        api.rpc.chain.getBlock(lastHeader.hash, (data) => {
          const { block } = data;
          const strBlockNum = block.header.number.toString();
          const secondsTime = getTimeInSeconds(block);

          // Get the previous block data by getting the previous node
          const prevBlock = block[blocks.length - 1];

          // Get the time between the timestamp of the current block and the
          // previous block
          const productionTime = prevBlock && prevBlock.timeStamp
            ? secondsTime - prevBlock.timeStamp : 6;

          // Create block instance
          // Add signed extrinsic count, total event count
          const blockObj = {
            number: strBlockNum,
            timeStamp: secondsTime,
            productionTime,
            extrinsicCount: block.extrinsics.length,
            hash: lastHeader.hash,
            parentHash: lastHeader.parentHash,
            author,
          };
          blocks.push(blockObj);

          // Create success message and add to DOM
          if (blocks.length === 1) {
            terminal.append(successMessage());
          }

          // Add block to terminal node
          displayBlock(blockObj, terminal);
        });
      });
    });
}

// export function findAuthor(api) {
//   api.rpc.chain.subscribeNewHeads((header) => {
//     // console.log(new HeaderExtended(header))
//     // console.log(api.derive.chain.headerExtended()); 
//     api.query.session.validators((validators) => {
//       const entity = header.digest.logs.find((log) => log.isPreRuntime);
//       const [engine, data] = entity.asPreRuntime;

//       const author = engine.extractAuthor(data, validators);
//       console.log(author.toString());
//     })
//     console.log('------');

//   });
// };

// function successMessage() {
//   return stringToNode(`
//           <div>
//             <p class='c-msg'> &nbsp;&nbsp; <span>></span> &nbsp;Connection succesful.</p>
//             <p  class='c-msg'> &nbsp;&nbsp; <span>></span> &nbsp;Blocks incoming.</p>
//             <br/>
//           </div>
//         `);
// }



// function findAuthor(header, validators) {
//   const entity = header.digest.logs.find((log) => log.isPreRuntime);
//   const [engine, data] = entity.asPreRuntime;
//   const author = engine.extractAuthor(data, validators);
//   return author.toString();
// }


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
