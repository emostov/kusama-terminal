// import { ApiPromise, WsProvider } from '@polkadot/api';

export const headers = {};
export const blocks = {};
export const nodeData = [];
export const linkData = [];

export function subscribeToBlockHeaders(api) {
  api.rpc.chain.subscribeNewHeads((lastHeader) => {
    headers[lastHeader.number] = lastHeader;

    // console.log(lastHeader.toString());

    api.rpc.chain.getBlock(lastHeader.hash, (data) => {
      const { block } = data;
      // console.log(block.header.toString());
      // const strBlockNum = block.header.number.toString();
      // console.log(block);

      // nodeData.push({
      //   id: strBlockNum,
      //   group: 1,
      // });

      // const prevBlock = nodeData[nodeData.length - 2]
      // if (prevBlock) {
      //   linkData.push({
      //     source: prevBlock.id,
      //     target: strBlockNum,
      //   });
      // }

      data.block.extrinsics.forEach((ex) => {
        if (ex.callIndex.toString() === '2,0') {
          console.log('amazing');
          const time = Date.now(ex.args.toString())
          console.log(time);
        };
        console.log(ex.args.toString());
        console.log(ex.callIndex.toString());
        // console.log(ex.args);
        console.log(ex.toString());
        console.log();
      });
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