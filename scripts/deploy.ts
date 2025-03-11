import { ethers, network, run } from "hardhat"

async function main() {
  // Get the deployer account
  const [deployer] = await ethers.getSigners()
  console.log("Deploying contracts with the account:", deployer.address)

  // Deploy the Forwarder contract for meta-transactions
  const Forwarder = await ethers.getContractFactory("MinimalForwarder")
  const forwarder = await Forwarder.deploy()
  await forwarder.deployed()
  console.log("MinimalForwarder deployed to:", forwarder.address)

  // Deploy the FridgeditionsNFT contract
  const baseURI = "ipfs://"
  const FridgeditionsNFT = await ethers.getContractFactory("FridgeditionsNFT")
  const fridgeditionsNFT = await FridgeditionsNFT.deploy(forwarder.address, baseURI)
  await fridgeditionsNFT.deployed()
  console.log("FridgeditionsNFT deployed to:", fridgeditionsNFT.address)

  // Verify contracts on Etherscan (if not on a local network)
  if (network.name !== "hardhat" && network.name !== "localhost") {
    console.log("Waiting for block confirmations...")
    await fridgeditionsNFT.deployTransaction.wait(5)

    console.log("Verifying contracts...")
    await run("verify:verify", {
      address: forwarder.address,
      constructorArguments: [],
    })

    await run("verify:verify", {
      address: fridgeditionsNFT.address,
      constructorArguments: [forwarder.address, baseURI],
    })
  }
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error)
    process.exit(1)
  })

