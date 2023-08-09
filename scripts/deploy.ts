import { ethers, upgrades } from "hardhat";

async function main() {

  const signers = await ethers.getSigners();

  // Library deployment
  const lib = await ethers.getContractFactory("CustomArray", { signer: signers[0] });
  const libInstance = await lib.deploy();
  await libInstance.deployed();
  console.log("Library Address--->" + libInstance.address)

  const ForwarderManagement = await ethers.getContractFactory("ForwarderManagement", { signer: signers[0], libraries: { CustomArray: libInstance.address } });
  const forwarderManagement = await upgrades.deployProxy(ForwarderManagement, ["0x902c38F2bcddF95E7BCE50A14515B4B62F502Bf2", "0x902c38F2bcddF95E7BCE50A14515B4B62F502Bf2"], {
    unsafeAllowLinkedLibraries: true,
  });
  await forwarderManagement.deployed();
  console.log("ForwarderManagement deployed to:", forwarderManagement.address);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
