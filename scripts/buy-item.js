const { ethers, network } = require("hardhat")
const { moveBlocks } = require("../utils/move-blocks")

async function buyItem() {
    const nftMarketplace = await ethers.getContract("NftMarketplace")
    const basicnft = await ethers.getContract("BasicNft")
    const nftAddress = basicnft.address
    const TOKEN_ID = 0
    const PRICE = ethers.utils.parseEther("0.1")

    const tx = await nftMarketplace.buyItem(nftAddress, TOKEN_ID, { value: PRICE })
    await tx.wait(1)

    console.log(`Bought NFT!`)

    if (network.config.chainId == "31337") {
        await moveBlocks(2, (sleepAmount = 1000))
    }
}

buyItem()
    .then(() => process.exit(0))
    .catch((e) => {
        console.error(e)
        process.exit(1)
    })
