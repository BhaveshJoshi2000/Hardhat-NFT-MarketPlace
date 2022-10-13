const { assert, expect } = require("chai")
const { network, deployments, ethers } = require("hardhat")
const { developmentChains } = require("../../helper-hardhat-config")

!developmentChains.includes(network.name)
    ? describe.skip
    : describe("NFT Market place test", function () {
          let nftMarketplace, nftMarketplaceContract, basicNft, basicNftContract
          const PRICE = ethers.utils.parseEther("0.01")
          const TOKEN_ID = 0

          beforeEach(async function () {
              const accounts = await ethers.getSigners()
              deployer = accounts[0]
              player = accounts[1]
              await deployments.fixture(["all"])
              nftMarketplaceContract = await ethers.getContract("NftMarketplace")
              nftMarketplace = nftMarketplaceContract.connect(deployer)
              basicNftContract = await ethers.getContract("BasicNft")
              basicNft = basicNftContract.connect(deployer)
              await basicNft.mintNft()
              await basicNft.approve(nftMarketplaceContract.address, TOKEN_ID)
          })

          describe("listItems", function () {
              it("reverts if NFT is Alredy Listed", async function () {
                  await nftMarketplaceContract.listItem(basicNftContract.address, TOKEN_ID, PRICE)

                  await expect(
                      nftMarketplaceContract.listItem(basicNftContract.address, TOKEN_ID, PRICE)
                  ).to.be.revertedWith("NftMarketPlace__AlreadyListed")
              })

              it("reverts if lister is not owner of the NFT", async function () {
                  await basicNft.mintNft()
                  await expect(
                      nftMarketplaceContract
                          .connect(player)
                          .listItem(basicNftContract.address, TOKEN_ID, PRICE)
                  ).to.be.revertedWith("NftMarketPlace__NotOwner")
              })

              it("reverts when price is less than or equal to zero", async function () {
                  await expect(
                      nftMarketplaceContract.listItem(basicNftContract.address, TOKEN_ID, 0)
                  ).to.be.revertedWith("NftMarketPlace__PriceMustBeAboveZero")
              })

              it("reverts when our contract is not approved by NFT Contract", async function () {
                  await basicNft.approve(ethers.constants.AddressZero, TOKEN_ID)
                  await expect(
                      nftMarketplace.listItem(basicNft.address, TOKEN_ID, PRICE)
                  ).to.be.revertedWith("NotApprovedForMarketplace")
              })

              it("adds NFT to listing mapping", async function () {
                  await nftMarketplace.listItem(basicNftContract.address, TOKEN_ID, PRICE)

                  const listing = await nftMarketplace.getListing(basicNft.address, TOKEN_ID)

                  //   assert(listing)
                  assert.equal(listing.price.toString(), PRICE.toString())
                  assert.equal(listing.seller.toString(), deployer.address)
              })

              it("emits an event after the NFT is Listed", async function () {
                  expect(await nftMarketplace.listItem(basicNft.address, TOKEN_ID, PRICE)).to.emit(
                      "ItemListed"
                  )
              })
          })

          describe("buyItem", function () {
              it("reverts when requested item is not listed", async function () {
                  await expect(
                      nftMarketplace.buyItem(basicNft.address, TOKEN_ID, { value: PRICE })
                  ).to.be.revertedWith(`NftMarketPlace__NotListed`)
              })

              it("reverts when value sent is less than the listed price for Nft", async function () {
                  await nftMarketplace.listItem(basicNftContract.address, TOKEN_ID, PRICE)

                  nftMarketplace = nftMarketplaceContract.connect(player)

                  await expect(
                      nftMarketplace.buyItem(basicNft.address, TOKEN_ID, { value: 0 })
                  ).to.be.revertedWith("NftMarketPlace__PriceNotMet")
              })

              it("updates proceed of the seller when NFT is sold", async function () {
                  await nftMarketplace.listItem(basicNftContract.address, TOKEN_ID, PRICE)

                  nftMarketplace = nftMarketplaceContract.connect(player)

                  await nftMarketplace.buyItem(basicNft.address, TOKEN_ID, { value: PRICE })

                  const proceed = await nftMarketplace.getProceeds(deployer.address)

                  assert.equal(proceed.toString(), PRICE.toString())
              })

              it("deletes the sold nft form listing", async function () {
                  await nftMarketplace.listItem(basicNftContract.address, TOKEN_ID, PRICE)

                  nftMarketplace = nftMarketplaceContract.connect(player)

                  await nftMarketplace.buyItem(basicNft.address, TOKEN_ID, { value: PRICE })

                  const listing = await nftMarketplace.getListing(basicNft.address, TOKEN_ID)

                  assert.equal(listing.price.toString(), "0")
              })

              it("emits the event after selling the NFT", async function () {
                  await nftMarketplace.listItem(basicNftContract.address, TOKEN_ID, PRICE)

                  nftMarketplace = nftMarketplaceContract.connect(player)

                  expect(
                      await nftMarketplace.buyItem(basicNft.address, TOKEN_ID, { value: PRICE })
                  ).to.emit("ItemBought")
              })
          })
          describe("cancel item", function () {
              it("can only be called by the owner of Nft", async function () {
                  await nftMarketplace.listItem(basicNftContract.address, TOKEN_ID, PRICE)

                  nftMarketplace = nftMarketplaceContract.connect(player)

                  await expect(
                      nftMarketplace.cancelListing(basicNft.address, TOKEN_ID)
                  ).to.be.revertedWith("NftMarketPlace__NotOwner")
              })

              it("reverts when NFT is Not Listed", async function () {
                  await expect(
                      nftMarketplace.cancelListing(basicNft.address, TOKEN_ID)
                  ).to.be.revertedWith("NftMarketPlace__NotListed")
              })

              it("Successfully deletes the NFT from Listing", async function () {
                  await nftMarketplace.listItem(basicNft.address, TOKEN_ID, PRICE)

                  await nftMarketplace.cancelListing(basicNft.address, TOKEN_ID)

                  const listing = await nftMarketplace.getListing(basicNft.address, TOKEN_ID)

                  assert.equal(listing.price.toString(), "0")
              })

              it("emits the event after canceling the NFT from Listing", async function () {
                  await nftMarketplace.listItem(basicNft.address, TOKEN_ID, PRICE)

                  expect(await nftMarketplace.cancelListing(basicNft.address, TOKEN_ID)).to.emit(
                      "ItemCanceled"
                  )
              })
          })
          describe("Update Listing", function () {
              it("can only be called by owner of nft", async function () {
                  await nftMarketplace.listItem(basicNftContract.address, TOKEN_ID, PRICE)

                  nftMarketplace = nftMarketplaceContract.connect(player)
                  const newPrice = ethers.utils.parseEther("0.2")
                  await expect(
                      nftMarketplace.updateListing(basicNft.address, TOKEN_ID, newPrice)
                  ).to.be.revertedWith("NftMarketPlace__NotOwner")
              })

              it("reverts when nft is not listed", async function () {
                  const newPrice = ethers.utils.parseEther("0.2")
                  await expect(
                      nftMarketplace.updateListing(basicNft.address, TOKEN_ID, newPrice)
                  ).to.be.revertedWith("NftMarketPlace__NotListed")
              })

              it("successfully updates the price of the NFT", async function () {
                  await nftMarketplace.listItem(basicNftContract.address, TOKEN_ID, PRICE)

                  const newPrice = ethers.utils.parseEther("0.2")
                  await nftMarketplace.updateListing(basicNft.address, TOKEN_ID, newPrice)

                  const listing = await nftMarketplace.getListing(basicNft.address, TOKEN_ID)

                  assert.equal(listing.price.toString(), newPrice.toString())
              })

              it("emits event after Price is updated", async function () {
                  await nftMarketplace.listItem(basicNftContract.address, TOKEN_ID, PRICE)

                  const newPrice = ethers.utils.parseEther("0.2")

                  it("emits an event after the NFT is Listed", async function () {
                      expect(
                          await nftMarketplace.updateListing(basicNft.address, TOKEN_ID, newPrice)
                      ).to.emit("ItemListed")
                  })
              })
          })
          describe("withdraw Proceess", function () {
              it("reverts when proceed is zero for caller", async function () {
                  await expect(nftMarketplace.withdrawProceeds()).to.be.revertedWith(
                      "NftMarketPlace__NoProceeds"
                  )
              })

              it("deletes the Proceeds of the sender", async function () {
                  await nftMarketplace.listItem(basicNft.address, TOKEN_ID, PRICE)
                  nftMarketplace = nftMarketplaceContract.connect(player)
                  await nftMarketplace.buyItem(basicNft.address, TOKEN_ID, { value: PRICE })
                  nftMarketplace = nftMarketplaceContract.connect(deployer)
                  await nftMarketplace.withdrawProceeds()

                  const proceed = await nftMarketplace.getProceeds(deployer.address)

                  assert.equal(proceed, 0)
              })

              it("Successfully transfers the amount to the caller", async function () {
                  await nftMarketplace.listItem(basicNft.address, TOKEN_ID, PRICE)

                  await nftMarketplace.buyItem(basicNft.address, TOKEN_ID, { value: PRICE })

                  const initialProceed = await nftMarketplace.getProceeds(deployer.address)
                  const initialBalance = await deployer.getBalance()
                  const tx = await nftMarketplace.withdrawProceeds()
                  const txReceipt = await tx.wait(1)

                  const { gasUsed, effectiveGasPrice } = txReceipt
                  const gasCost = gasUsed.mul(effectiveGasPrice)
                  const finalBalance = await deployer.getBalance()

                  assert(
                      finalBalance.add(gasCost).toString() ==
                          initialProceed.add(initialBalance).toString()
                  )
              })
          })
      })
