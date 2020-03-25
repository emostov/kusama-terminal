// import { ApiPromise, WsProvider } from '@polkadot/api';

export const headers = {};
export const blocks = {};
export const nodes = [];
export const links = [];

export function subscribeToBlockHeaders(api) {
  api.rpc.chain.subscribeNewHeads((lastHeader) => {
    headers[lastHeader.number] = lastHeader;

    // console.log(lastHeader.toString());

    api.rpc.chain.getBlock(lastHeader.hash, (data) => {
      const { block } = data;

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
      const prevBlock = nodes[nodes.length - 1];

      // Get the time between the timestamp of the current block and the
      // previous block
      const productionTime = prevBlock && prevBlock.timeStamp
        ? secondsTime - prevBlock.timeStamp : 6;

      // Create node object add add to array of nodes
      nodes.push({
        id: strBlockNum,
        group: 1,
        timeStamp: secondsTime,
        productionTime,
      });
      console.log(nodes);

      // if this is not the first block create a link
      if (prevBlock) {
        links.push({
          source: prevBlock.id,
          target: strBlockNum,
        });
      }

    });
  });


}

export async function getAddressInfor() {
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