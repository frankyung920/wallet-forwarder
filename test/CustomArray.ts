import { expect, use } from "chai"
import { Contract, utils, Wallet } from "ethers"
const { ethers, waffle } = require('hardhat');
import {
    deployContract,
    deployMockContract,
    MockProvider,
    solidity,
  } from "ethereum-waffle"
  
use(solidity)

describe("CustomArray", function (){
    let customArray: any;
    let addr1: any, addr2: any, addr3: any, addr4: any, addr5: any, addr6: any, addr7: any, addr8: any, addr9: any, addr10: any, addr11: any;
    let arr: any;

    before(async () => {
        const CustomArray = await ethers.getContractFactory("CustomArray");
        customArray = await CustomArray.deploy();
        [addr1, addr2, addr3, addr4, addr5, addr6, addr7, addr8, addr9, addr10, addr11] = await ethers.getSigners();
        arr = [addr1.address, addr2.address, addr3.address, addr4.address, addr5.address, addr6.address, addr7.address, addr8.address, addr9.address, addr10.address];
    });
    
    describe("findIndex", function (){
        it("Successfully find index for an address in an array", async function() {
            const result = await customArray.findIndex(arr, addr5.address);
            expect(Number(result)).to.be.equal(4);
        });

        it("Element not found in an array", async function() {
            await expect(customArray.findIndex(arr, addr11.address)).to.be.revertedWith('CustomArray: Element not found');
        });
    });

});

