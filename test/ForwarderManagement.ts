import { expect, use } from "chai"
import { Contract, utils, Wallet } from "ethers"
import {
    solidity,
  } from "ethereum-waffle"
const { ethers, waffle } = require('hardhat');
import forwarderABI = require('../artifacts/contracts/Forwarder.sol/Forwarder.json');

use(solidity)

describe("ForwarderMangagement", function (){
    let forwarderManagement: any;
    let admin: any, flusher1: any, flusher2: any, forwarder1: any, forwarder2: any, validFlushToAddress1: any, validFlushToAddress2: any, dummy1: any, dummy2: any, dummy3: any;

    before(async () => {
        const Lib = await ethers.getContractFactory("CustomArray");
        const lib = await Lib.deploy();
        await lib.deployed();
        const ForwarderManagement = await ethers.getContractFactory("ForwarderManagement", {
            signer: admin,
            libraries: {
                CustomArray: lib.address,
            },
          });
        forwarderManagement = await ForwarderManagement.deploy();
        await forwarderManagement.deployed();
        [admin, flusher1, flusher2, validFlushToAddress1, validFlushToAddress2, dummy1, dummy2, dummy3] = await ethers.getSigners();

        forwarderManagement.initialize(admin.address, validFlushToAddress1.address);
    });

    describe("addValidFlushToAddress", function (){
        let address = "";
        beforeEach(() => {
            address = validFlushToAddress2.address;
        })

        it("Successfully added valid 'flush to address'", async function() {
            await expect(forwarderManagement.addValidFlushToAddress(address))
            .to.emit(forwarderManagement, "AddFlushToAddress")
            .withArgs(address);
        });

        it("Address already exists", async function() {
            await expect(forwarderManagement.addValidFlushToAddress(address)).to.be.revertedWith('ForwarderManagement: Address already exists');
        });

        it("Function called by non-admin", async function() {
            await expect(forwarderManagement.connect(dummy1).addValidFlushToAddress(address)).to.be.revertedWith('ForwarderManagement: Must have ADMIN ROLE');
        });
    });

    describe("removeValidFlushToAddress", function() {
        let address = "";
        beforeEach(() => {
            address = validFlushToAddress2.address;
        })

        it("Successfully removed valid 'flush to address'", async function() {
            await expect(forwarderManagement.removeValidFlushToAddress(address))
            .to.emit(forwarderManagement, "RemoveFlushToAddress")
            .withArgs(address);
        });

        it("Address already already removed", async function() {
            await expect(forwarderManagement.addValidFlushToAddress(address))
            .to.emit(forwarderManagement, "AddFlushToAddress")
            .withArgs(address);

            await expect(forwarderManagement.removeValidFlushToAddress(address))
            .to.emit(forwarderManagement, "RemoveFlushToAddress")
            .withArgs(address);

            await expect(forwarderManagement.removeValidFlushToAddress(address))
            .to.be.revertedWith('ForwarderManagement: Address already removed or doesnt exist');
        });

        it("Address doesn't exist", async function() {
            await expect(forwarderManagement.removeValidFlushToAddress(dummy1.address))
            .to.be.revertedWith('ForwarderManagement: Address already removed or doesnt exist');
        });

        it("Function called by non-admin", async function() {
            await expect(forwarderManagement.connect(dummy1).removeValidFlushToAddress(validFlushToAddress2.address)).to.be.revertedWith('ForwarderManagement: Must have ADMIN ROLE');
        });
    })
    
    describe("addFlusher", function (){
        let address = "";
        beforeEach(() => {
            address = flusher1.address;
        })

        it("Successfully added flusher", async function() {
            await expect(forwarderManagement.addFlusher(address))
            .to.emit(forwarderManagement, "AddFlusher")
            .withArgs(address);
        });

        it("Address already exists", async function() {
            await expect(forwarderManagement.addFlusher(address)).to.be.revertedWith('ForwarderManagement: Address already exists');
        });

        it("Function called by non-admin", async function() {
            await expect(forwarderManagement.connect(dummy1).addFlusher(flusher2.address)).to.be.revertedWith('ForwarderManagement: Must have ADMIN ROLE');
        });
    });

    describe("removeFlusher", function() {
        let address = "";
        beforeEach(() => {
            address = flusher1.address;
        })

        it("Successfully removed flusher", async function() {
            await expect(forwarderManagement.removeFlusher(address))
            .to.emit(forwarderManagement, "RemoveFlusher")
            .withArgs(address);
        });

        it("Address already already removed", async function() {
            await expect(forwarderManagement.addFlusher(address))
            .to.emit(forwarderManagement, "AddFlusher")
            .withArgs(address);
            await expect(forwarderManagement.removeFlusher(address))
            .to.emit(forwarderManagement, "RemoveFlusher")
            .withArgs(address);
            await expect(forwarderManagement.removeFlusher(address))
            .to.be.revertedWith('ForwarderManagement: Address already removed or doesnt exist');
        });

        it("Address doesn't exist", async function() {
            await expect(forwarderManagement.removeFlusher(dummy1.address))
            .to.be.revertedWith('ForwarderManagement: Address already removed or doesnt exist');
        });

        it("Function called by non-admin", async function() {
            await expect(forwarderManagement.connect(dummy1).removeFlusher(flusher2.address)).to.be.revertedWith('ForwarderManagement: Must have ADMIN ROLE');
        });
    })

    describe("isFlusher", function (){
        let flusher = "";
        beforeEach(() => {
            flusher = flusher1.address;
        })
        
        it("Check whether it is flusher", async function() {
            const result1 = await forwarderManagement.isFlusher(flusher)
            expect(result1).to.equal(false);

            await expect(forwarderManagement.addFlusher(flusher))
            .to.emit(forwarderManagement, "AddFlusher")
            .withArgs(flusher);

            const result2 = await forwarderManagement.isFlusher(flusher)
            expect(result2).to.equal(true);

            await expect(forwarderManagement.removeFlusher(flusher))
            .to.emit(forwarderManagement, "RemoveFlusher")
            .withArgs(flusher);

            const result3 = await forwarderManagement.isFlusher(flusher)
            expect(result3).to.equal(false);
        })
    })  

    describe("isValidFlushToAddress", function (){
        let flushToAddress = "";
        beforeEach(() => {
            flushToAddress = validFlushToAddress2.address;
        })
        
        it("Check whether it is flusher", async function() {
            const result1 = await forwarderManagement.isValidFlushToAddress(flushToAddress)
            expect(result1).to.equal(false);

            await expect(forwarderManagement.addValidFlushToAddress(flushToAddress))
            .to.emit(forwarderManagement, "AddFlushToAddress")
            .withArgs(flushToAddress);

            const result2 = await forwarderManagement.isValidFlushToAddress(flushToAddress)
            expect(result2).to.equal(true);

            await expect(forwarderManagement.removeValidFlushToAddress(flushToAddress))
            .to.emit(forwarderManagement, "RemoveFlushToAddress")
            .withArgs(flushToAddress);

            const result3 = await forwarderManagement.isValidFlushToAddress(flushToAddress)
            expect(result3).to.equal(false);
        });
    });

    describe("createForwarder", function (){
        let flushToAddress = "";
        beforeEach(() => {
            flushToAddress = validFlushToAddress2.address;
        })

        it("Successfully creates a forwarder", async function () {
            await expect(forwarderManagement.addValidFlushToAddress(flushToAddress)).to.emit(forwarderManagement, "AddFlushToAddress").withArgs(flushToAddress);
            const result = await forwarderManagement.callStatic.createForwarder(flushToAddress);
            await expect(forwarderManagement.createForwarder(flushToAddress)).to.emit(forwarderManagement, "ForwarderCreated").withArgs(admin.address, result);
        });
    }); 

    describe("flushFowarderTokens", function (){
        let flushToAddress = "";
        beforeEach(() => {
            flushToAddress = validFlushToAddress2.address;
        });

        it("Successfully flushing forwarder tokens to a valid address", async function () {
            
        });

        it("Invalid flush to address", async function () {
            
        });
    })
});
