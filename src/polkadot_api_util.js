// import { ApiPromise, WsProvider } from '@polkadot/api';

export const headers = {};
export const blocks = {}

export function subscribeToBlockHeaders(api) {
  api.rpc.chain.subscribeNewHeads((lastHeader) => {
    headers[lastHeader.number] = lastHeader;

    api.rpc.chain.getBlock(lastHeader.hash, (block) => {

      console.log(block.toString());

    });

  });


}

export async function getAddressInfor() {
  return -1;
}