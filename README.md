# Fridgeditions NFT Platform

This repository contains the smart contracts and frontend integration for the Fridgeditions NFT platform.

## Overview

Fridgeditions is a platform that allows users to mint children's artwork as NFTs on the Base L2 network. The platform covers gas fees for users, making it free to mint artwork on the blockchain.

## Smart Contract

The `FridgeditionsNFT` contract is an ERC-1155 contract that supports:

- Minting both 1/1 and multiple edition NFTs
- Gas-free transactions for users (gas sponsored by the platform)
- Configurable pricing for artwork
- Metadata handling via IPFS

## Development Setup

### Prerequisites

- Node.js (v18+)
- npm or yarn
- Hardhat
- An Ethereum wallet with some Base (testnet or mainnet) ETH

### Installation

1. Clone the repository and install dependencies:

```bash
npm install

# fridgeditions-solidity
