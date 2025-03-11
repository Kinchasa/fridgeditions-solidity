const { expect } = require("chai")
const { ethers } = require("hardhat")

describe("FridgeditionsNFT", () => {
  let FridgeditionsNFT
  let fridgeditionsNFT
  let owner
  let artist
  let collector
  const baseURI = "ipfs://"

  beforeEach(async () => {
    // Get signers for test accounts
    ;[owner, artist, collector] = await ethers.getSigners()

    // Deploy the contract
    FridgeditionsNFT = await ethers.getContractFactory("FridgeditionsNFT")
    fridgeditionsNFT = await FridgeditionsNFT.deploy(baseURI)
  })

  describe("Deployment", () => {
    it("Should set the correct owner", async () => {
      expect(await fridgeditionsNFT.owner()).to.equal(owner.address)
    })

    it("Should set the correct base URI", async () => {
      expect(await fridgeditionsNFT.baseURI()).to.equal(baseURI)
    })
  })

  describe("Artwork Creation", () => {
    it("Should create artwork correctly", async () => {
      const maxSupply = 5
      const price = ethers.parseEther("0.1")
      const tokenURI = "ipfs://QmXuTSpihVhbRBvujoPxWZWo4jLhRhVHBq3SVrhHMkYNHB"

      await fridgeditionsNFT.createArtwork(maxSupply, artist.address, price, tokenURI)

      const tokenId = 1
      expect(await fridgeditionsNFT.maxSupply(tokenId)).to.equal(maxSupply)
      expect(await fridgeditionsNFT.artistAddress(tokenId)).to.equal(artist.address)
      expect(await fridgeditionsNFT.tokenPrice(tokenId)).to.equal(price)
      expect(await fridgeditionsNFT.uri(tokenId)).to.equal(tokenURI)
    })

    it("Should create a 1/1 edition correctly", async () => {
      const maxSupply = 1
      const price = ethers.parseEther("0.5")
      const tokenURI = "ipfs://QmXuTSpihVhbRBvujoPxWZWo4jLhRhVHBq3SVrhHMkYNHB"

      await fridgeditionsNFT.createArtwork(maxSupply, artist.address, price, tokenURI)

      const tokenId = 1
      expect(await fridgeditionsNFT.isOneOfOne(tokenId)).to.equal(true)
    })
  })

  describe("Minting", () => {
    beforeEach(async () => {
      // Create a free artwork
      await fridgeditionsNFT.createArtwork(
        10, // maxSupply
        artist.address,
        0, // free
        "ipfs://QmXuTSpihVhbRBvujoPxWZWo4jLhRhVHBq3SVrhHMkYNHB",
      )

      // Create a paid artwork
      await fridgeditionsNFT.createArtwork(
        5, // maxSupply
        artist.address,
        ethers.parseEther("0.1"), // 0.1 ETH
        "ipfs://QmXuTSpihVhbRBvujoPxWZWo4jLhRhVHBq3SVrhHMkYNHB",
      )
    })

    it("Should mint a free artwork via platform", async () => {
      await fridgeditionsNFT.mintByPlatform(collector.address, 1, 1)
      expect(await fridgeditionsNFT.balanceOf(collector.address, 1)).to.equal(1)
    })

    it("Should mint multiple editions", async () => {
      await fridgeditionsNFT.mintByPlatform(collector.address, 1, 3)
      expect(await fridgeditionsNFT.balanceOf(collector.address, 1)).to.equal(3)
    })

    it("Should not mint beyond max supply", async () => {
      await fridgeditionsNFT.mintByPlatform(collector.address, 1, 5)
      await expect(fridgeditionsNFT.mintByPlatform(collector.address, 1, 6)).to.be.revertedWith(
        "FridgeditionsNFT: exceeds max supply",
      )
    })
  })

  describe("Administration", () => {
    it("Should update price correctly", async () => {
      // Create artwork
      await fridgeditionsNFT.createArtwork(
        5,
        artist.address,
        ethers.parseEther("0.1"),
        "ipfs://QmXuTSpihVhbRBvujoPxWZWo4jLhRhVHBq3SVrhHMkYNHB",
      )

      const tokenId = 1
      const newPrice = ethers.parseEther("0.2")

      await fridgeditionsNFT.updatePrice(tokenId, newPrice)
      expect(await fridgeditionsNFT.tokenPrice(tokenId)).to.equal(newPrice)
    })

    it("Should pause and unpause minting", async () => {
      // Create artwork
      await fridgeditionsNFT.createArtwork(
        5,
        artist.address,
        0,
        "ipfs://QmXuTSpihVhbRBvujoPxWZWo4jLhRhVHBq3SVrhHMkYNHB",
      )

      // Pause minting
      await fridgeditionsNFT.setPaused(true)

      // Try to mint
      await expect(fridgeditionsNFT.sponsoredMint(collector.address, 1, 1)).to.be.revertedWith(
        "FridgeditionsNFT: minting is paused",
      )

      // Unpause minting
      await fridgeditionsNFT.setPaused(false)

      // Should be able to mint now
      await fridgeditionsNFT.sponsoredMint(collector.address, 1, 1)
      expect(await fridgeditionsNFT.balanceOf(collector.address, 1)).to.equal(1)
    })
  })
})

