const { ethers, network } = require("hardhat")
const { moveBlocks } = require("../utils/move-blocks")

async function cancel() {
    const nftMarketplace = await ethers.getContract("NftMarketplace")
    const basicnft = await ethers.getContract("BasicNft")
    const nftAddress = basicnft.address
    const TOKEN_ID = 3

    const tx = await nftMarketplace.cancelListing(nftAddress, TOKEN_ID)
    await tx.wait(1)

    console.log(`Itemcanceled`)

    if (network.config.chainId == "31337") {
        await moveBlocks(2, (sleepAmount = 1000))
    }
}

cancel()
    .then(() => process.exit(0))
    .catch((e) => {
        console.error(e)
        process.exit(1)
    })
