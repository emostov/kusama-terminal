# Kusama Terminal

A live block feed from Polkadots canary network, Kusama.

###### [Live Site](https://emostov.github.io/kusama-terminal/dist/)

## Table of Contents

* [Background](#background)
* [Technologies](#technologies)
* [Technical Highlights](#technical-highligths)

---

## Background

###### [Jump to Technologies](#technologies)

The aim of this project was to learn about Polkadot, Substrate, and the role of Kusama in devloping Polkadot. I find Polkadot exciting because its approach to chain interopability seems to have potential for broadening the practical use of blockchain, and reducing bounds of scalability found in other projects.

My journey for this project brought me to participate in Parities Riot chat rooms, read through depths of Parities and Web3foundations documentation, and scouring the quickly evolving codebases of Substrate (Rust) and Polkadot.js (TypeScript). While not reflected directly in the scripts for this project, I was able to significantly further my understanding of Polkadot's NPoS protocol and their various solutions on chain interopability.

Much of the challenges from this project where due to the quickly evolving nature of Polkadot's ecosystem, the resulting gaps in documentation, and just minimal resources in general compared to the ecosystems surrounding more matured protocols. This made it a good oppurtunity for me to work on my skills of reading through GitHub codebases.

The publically tangible result of my research is this quick project. I eschewed any frontend frameworks, and instead decided to keep it as simple as possible. The idea is to provide a very simple and aestheticaly appealing interface that gives a pulse about the state of the newest blocks.

The block feed mimics the appearance of a modern Mac terminal, updates upon succesful connection to Kussama, and subsequently updates the block feed as new blocks come in. The feed displays essential information, with things such as block author and timestamp, which are not trivial to extract. Some fields, such as block author, link to the relevant page on Polkascan so the user can get more info if desired. 

At the time of writing Polkadot has yet to go public with their mainnet.

---

## Technologies

###### [Jump to Technical Highlights](#technical-highlights)

* Kusama
* Polkadotjs
* Vanila Javascript
* Webpack

---

## Technical Highlights