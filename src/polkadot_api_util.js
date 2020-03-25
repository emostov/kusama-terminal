// import { ApiPromise, WsProvider } from '@polkadot/api';

export const headers = {};
export const blocks = {};

export function subscribeToBlockHeaders(api) {
  api.rpc.chain.subscribeNewHeads((lastHeader) => {
    headers[lastHeader.number] = lastHeader;

    api.rpc.chain.getBlock(lastHeader.hash, (data) => {
      data.block.extrinsics.forEach((ex) => {
        console.log(ex.toString());
        console.log(ex.signer.toString());
      });
    });

  });


}

export async function getAddressInfor() {
  return -1;
}