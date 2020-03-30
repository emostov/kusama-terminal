
import { displayBlock, successMessage } from './utils';

export const blocks = [];

function getTimeInSeconds(block) {
  const timeEx = block.extrinsics.find(
    (ex) => ex.callIndex.toString() === '2,0',
  );

  const intTime = parseInt(timeEx.args.toString(), 10);
  return Math.floor(intTime / 1000);
}

function findAuthor(header, validators) {
  const entity = header.digest.logs.find((log) => log.isPreRuntime);
  const [engine, data] = entity.asPreRuntime;
  const author = engine.extractAuthor(data, validators);
  return author.toString();
}

// Takes in the api object and the terminal, a DOM node for later use
export function subscribeToBlockHeaders(api, terminal) {

  // Get the validators to use later
  api.query.session.validators()
    .then((validators) => {
      api.rpc.chain.subscribeNewHeads((lastHeader) => {

        // Get the block author from the method in the earlier section
        const author = findAuthor(lastHeader, validators);

        // Use the hash to fetch the corresponding block
        api.rpc.chain.getBlock(lastHeader.hash, (data) => {
          const { block } = data;

          // Get the previous block data by getting the previous node
          const prevBlock = block[blocks.length - 1];

          const secondsTime = getTimeInSeconds(block);

          // Get the time between the timestamp of the current block and the
          // previous block
          const productionTime = prevBlock && prevBlock.timeStamp
            ? secondsTime - prevBlock.timeStamp : 6;

          // Create block instance
          // Add signed extrinsic count, total event count
          const blockObj = {
            number: block.header.number.toString(),
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
