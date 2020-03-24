// import { ApiPromise, WsProvider } from '@polkadot/api';

export const headers = {};

export function subscribeToBlockHeaders(api) {
  // api.rpc.chain.subscribeNewHeads((lastHeader) => {
  //   headers[lastHeader.number] = lastHeader;
  //   // console.log('subscribe to head', `${lastHeader.number}`);
  //   console.log(`#${lastHeader.number} has hash ${lastHeader.hash}`);
  //   console.log(lastHeader.digest.logs);
  // });

  api.rpc.chain.getBlock((block) => {
    // headers[lastHeader.number] = lastHeader;
    console.log(block);
    console.log(block.toString());
    // console.log('subscribe to head', `${lastHeader.number}`);
    // console.log(`#${lastHeader.number} has hash ${lastHeader.hash}`);
    // console.log(lastHeader.digest.logs);
  });
}

export async function getAddressInfor() {
  return -1;
}