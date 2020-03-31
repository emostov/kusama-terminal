# Kusama Terminal

A live block feed for Polkadot's canary network, Kusama.

###### [Live Site](https://emostov.github.io/kusama-terminal/dist/)

![start-connection](src/connect-original-long.gif "Start Connection")

## Table of Contents

* [Background](#background)
* [Technologies](#technologies)
* [Technical Highlights](#technical-highligths)

---

## Background

###### [Jump to Technologies](#technologies)

The aim of this project was to learn about Polkadot, Substrate, and the role of Kusama in developing Polkadot. I find Polkadot exciting because its approach to chain interoperability seems to have potential for broadening the practical use of blockchain, and reducing bounds of scalability found in other projects.

My journey for this project brought me to participate in Paritie's Riot chat rooms, read through depths of Paritie's and Web3 Foundation's documentation, and scour the quickly evolving codebases of Substrate (Rust) and Polkadot.js (TypeScript). While not necessarily reflected directly in the scripts for this project, I was able to significantly further my understanding of Polkadot's NPoS protocol and their various solutions for chain interoperability.

Much of the challenges from this project were due to the quickly evolving nature of Polkadot's ecosystem, the resulting gaps in documentation, and minimal resources in general compared to the ecosystems surrounding more mature protocols. This made it a good opportunity for me to work on my skills of reading through GitHub codebases.

The publicly tangible result of my research is this quick project. I eschewed any frontend frameworks, and instead decided to keep it as simple as possible. The idea for the site is to provide a very simple and aesthetically appealing interface that gives a pulse about the state of the newest blocks.

The block feed mimics the appearance of a modern Mac terminal. The terminal updates upon successful connection to Kusama, and subsequently updates the block feed as new blocks come in. The feed displays essential information, with things such as block author and timestamp, which are not trivial to extract. Some fields, such as block author, link to the relevant page on Polkascan so the user can get more info if desired.

---

## Technologies

###### [Jump to Technical Highlights](#technical-highlights)

* Kusama
* Polkadotjs
* Vanilla JavaScript
* Webpack

---

## Technical Highlights

### Getting timestamp

###### [Jump to next highlight](#getting-block-author)

In Polkadot, the block is divided into two main parts, Header and Extrinsics. Extrinsics represent any information that is external to the blockchain. Because of the generalizability of Polkadot, this means more than just signed transactions. There are three types of extrinsics:: signed transactions (analogous to transactions in Bitcoin, Ethereum etc.), unsigned transactions (used for a few specific use cases, such as creating an account, where there cannot be a key holder), and inherents.

For further references on intrinsics consult [this page](https://substrate.dev/docs/en/next/conceptual/node/extrinsics) from substrate.dev.

Inherents are added to the block by the author, and are simply accepted as true as long as they seem reasonable. They are not part of the normal transaction pool and are not gossiped. Instead they are just data points for a limited set of potential fields. The three most common inherents I encountered while looking through blocks for this project where ```set``` for time, ```final_hint``` for giving a hint of the best finalized block, and ```set_heads``` which includes candidate reciepts for parachain blocks (essentially minimized proofs of validity).

```javascript
// src/polkadot_api_util.js

function getTimeInSeconds(block) {

  // Loop through the blocks extrinsics
  const timeEx = block.extrinsics.find(

    // Check the call index to see if it is the "set" call, which indicates it
    // is an inherent for a timestamp given by the block author.
    // The call is represented by a hex number, however in this case, in order
    // to get consistent conversion I convert the hex number (which comes
    // across as an array) to a string and compare it to the string "2,0", which
    // is simply what that underlying array converts over to in vanilla js.
    (ex) => ex.callIndex.toString() === '2,0',
  );

  const intTime = parseInt(timeEx.args.toString(), 10);

   // Convert to seconds and round off decimals
  return Math.floor(intTime / 1000);
}

```

### Getting Block Author

###### [Jump to next highlight](#subscribe-to-latest-blocks)

In Polkadot, the minimal requirements for a block are designed to be as generic as possible. For example, there may be a parachain that does not have the notion of a block author. For this reason, block author is not an explicit field in the header, and instead can be found in the logs of the ```DigestItem```. The idea behind the code below is to extract the consensus engine ID and a number from the log, and then, using the current validator set, key into with the number and get the ```AccountId``` in return.

```javascript

function findAuthor(header, validators) {

  // Find the PreRunTime entry in the logs of the DigestItem. N.B. This is for
  // substrate 2.0. Substrate 1.0 we would look for the Consensus entry in the
  // logs. I have not verified this though for Substrate 1.0
  // For more reference on the DigestItem consult
  // https://github.com/paritytech/substrate/blob/master/primitives/runtime/src/generic/digest.rs
  const entity = header.digest.logs.find((log) => log.isPreRuntime);
  
  // Destructure the array stored under asPreRunTime to pull out the consensus
  // engine id and the data. The consensus engine id is either AURA, BABE, or
  // Granpa and is represented by a 4-byte identifier. It is important to know
  // the engine in this case because it will inform how we use the byte data to
  // key into the validator set.
  // For more information on the ConsesnsuEngineID consult 
  // https://github.com/polkadot-js/api/blob/master/packages/types/src/generic/ConsensusEngineId.tsq
  const [engine, data] = entity.asPreRuntime;

  // With the consensus engine id, we know how to use the data to key
  // into the right spot in the validator set and extract the author. I rely on
  // the extractAuthor from the ConsensusEngineId class
  const author = engine.extractAuthor(data, validators);
  return author.toString();
}

```

### Subscribe To Latest Blocks

Once the api instance is set up using the Kusama websocket provider, I query for the validatorSet so I can use it later when finding the block author. Then I subscribe to new headers using a convenient built in method api.rpc.chain.subscribeNewHeads(). I then use the hash from the header to query again for the latest block, which gives a full block - both header and intrinsics. While this is redundant, I have not come up with a better way to do it at this time.

```javascript

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

          // Get the blocks time stamp in seconds
          const secondsTime = getTimeInSeconds(block);

          // Get the time between the timestamp of the current block and the
          // previous block
          const productionTime = prevBlock && prevBlock.timeStamp
            ? secondsTime - prevBlock.timeStamp : 6;

          // Create block instance so we can pass the info we care about around
          // and store it for later
          const blockObj = {
            number: block.header.number.toString(),
            timeStamp: secondsTime,
            productionTime,
            extrinsicCount: block.extrinsics.length,
            hash: lastHeader.hash,
            parentHash: lastHeader.parentHash,
            author,
          };

          // Save block so we can refference it when the next block comes to
          // calculate the time deltas
          blocks.push(blockObj);

          // Create success message and add to terminal node
          if (blocks.length === 1) {
            terminal.append(successMessage());
          }

          // Add html for block to terminal node using a function from utils.js
          displayBlock(blockObj, terminal);
        });
      });
    });
}

```
