const { ethers, network } = require("hardhat")
const fs = require("fs")
const frontEndContractsFile = "../nextjs-moralis-nft-marketplace/constants/networkMapping.json"
const frontEndAbiLocation = "../nextjs-moralis-nft-marketplace/constants/"
module.exports = async function () {
    if (process.env.UPDATE_FRONT_END) {
        console.log("updating frontend...")
        await updateContractAddresses()
        await updateAbi()
    }
}

async function updateAbi() {
    const nftMarketplace = await ethers.getContract("NftMarketplace")
    fs.writeFileSync(
        `${frontEndAbiLocation}NftMarketplace.json`,
        nftMarketplace.interface.format(ethers.utils.FormatTypes.json)
    )

    const basicNft = await ethers.getContract("BasicNft")
    fs.writeFileSync(
        `${frontEndAbiLocation}BasicNft.json`,
        basicNft.interface.format(ethers.utils.FormatTypes.json)
    )
}

async function updateContractAddresses() {
    const nftMarketpalce = await ethers.getContract("NftMarketplace")
    const chainId = network.config.chainId.toString()

    const contractAddresses = JSON.parse(fs.readFileSync(frontEndContractsFile, "utf-8"))
    if (chainId in contractAddresses) {
        if (!contractAddresses[chainId]["NftMarketplace"].includes(nftMarketpalce.address)) {
            contractAddresses[chainId]["NftMarketplace"].push(nftMarketpalce.address)
        }
    } else {
        contractAddresses[chainId] = { NftMarketplace: [nftMarketpalce.address] }
    }
    fs.writeFileSync(frontEndContractsFile, JSON.stringify(contractAddresses))
}

module.exports.tags = ["all", "frontend"]
