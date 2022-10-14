# HARDHAT - NFT - MARKETPLACE

## About The Project

Here's the Backend project I built while learning how to make NFT Marketplace. This is Full-Fleged backend project with deployments, necessary tests and scripts. I used Hardhat and Ethers.js to make Backend and chai for testing the contracts.

I used a basic NFT minting contract which inherits <a herf = "https://github.com/OpenZeppelin/openzeppelin-contracts.git"> Openzeppelin's</a> ERC721 Implementation to Mint the NFTs to test the contracts on localchain.

<br>
<br>

> ### This Is Just the Backend part of Fullstack Project.

<br>
<br>

### Functionalaties:
<br>

* Constant Variables of the <a>Frontend Project</a> are automatically updated with addresses and ABIs of the contracts after deploying the contracts

* Verifies the contracts on etherscan automatically if Contracts are deployed on testnet

* You can list, update the price, buy, cancel the listing in this Marketplace.

* Maintains list of the earnings acquired by the owner and let them withdraw it anytime they want <a href="https://fravoll.github.io/solidity-patterns/pull_over_push.html">This is called Pull over Push</a> in which risk associated with transferring the Ether is shifted to user.

* Uses a helper file to keep record of various args and vairables of the smart contracts according to different chainId.

<br>


# Getting Started

## Requirements

- [git](https://git-scm.com/book/en/v2/Getting-Started-Installing-Git)
  - You'll know you did it right if you can run `git --version` and you see a response like `git version x.x.x`
- [Nodejs](https://nodejs.org/en/)
  - You'll know you've installed nodejs right if you can run:
    - `node --version` and get an ouput like: `vx.x.x`
- [Yarn](https://classic.yarnpkg.com/lang/en/docs/install/) instead of `npm`
  - You'll know you've installed yarn right if you can run:
    - `yarn --version` and get an output like: `x.x.x`
    - You might need to install it with `npm`

## Quickstart

```
git clone https://github.com/BhaveshJoshi2000/Hardhat-NFT-MarketPlace.git
cd Hardhat-NFT-MarketPlace
yarn
```

# Usage

Deploy:

```
yarn hardhat deploy
```

## Testing

```
yarn hardhat test
```



# Deployment to a testnet or mainnet

1. Setup environment variabltes

You'll want to set your `GOERLI_RPC_URL` and `PRIVATE_KEY` as environment variables. You can add them to a `.env` file, similar to what you see in `.env.example`.

- `PRIVATE_KEY`: The private key of your account (like from [metamask](https://metamask.io/)). **NOTE:** FOR DEVELOPMENT, PLEASE USE A KEY THAT DOESN'T HAVE ANY REAL FUNDS ASSOCIATED WITH IT.
  - You can [learn how to export it here](https://metamask.zendesk.com/hc/en-us/articles/360015289632-How-to-Export-an-Account-Private-Key).
- `GOERLI_RPC_URL`: This is url of the goerli testnet node you're working with. You can get setup with one for free from [Alchemy](https://alchemy.com/?a=673c802981)

2. Get testnet ETH

Head over to [faucets.chain.link](https://faucets.chain.link/) and get some tesnet ETH. You should see the ETH show up in your metamask.

3. Deploy

```
yarn hardhat deploy --network goerli
```


# Thank you!


