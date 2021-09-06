const { expect } = require ('chai');
//const { ethers } = require('ethers');
//const { isCallTrace } = require('hardhat/internal/hardhat-network/stack-traces/message-trace');

describe('NFT', function() {
    beforeEach(async function() {
        NFT = await ethers.getContractFactory("NFT");
        let balance;
        let total;
        [own, add1, add2, ...addrs] = await ethers.getSigners();
        nft = await NFT.deploy();
        await nft.deployed;
    });

    describe("Deployment", function() {
        it("Only 1 token", async function () {
            await nft.createRing();
            total = nft.totalSupply();
            expect(await total).to.equal(1);
        });
        it("Only one token in balance", async function () {
            await nft.createRing();
            expect(await nft.balanceOf(own.address)).to.equal(1);
        });
    })
})

describe('Tax', function() {
    // Deploy the contract
    let owner;
    let addr1;
    let addr2;
    let addrs;
    
    beforeEach(async function() {
        Token = await ethers.getContractFactory("Tax");
        [owner, addr1, addr2, ...addrs] = await ethers.getSigners();

        tax = await Token.deploy(2, 3);
        await tax.deployed();
    });

    describe("Deployment", function() {
        it("Should assign the total supply of tokens to the owner", async function () {
            const ownerBalance = await tax.balanceOf(owner.address);
            expect(await tax.totalSupply()).to.equal(ownerBalance);
          });
    });

    describe("Send tokens and check tax collection", function() {
        it("Send 100 tokens to addr1 after making addr2 tax collector", async function () {
            await tax.updateTaxCollector(addr2.address);
            await tax.approve(addr1.address, 1000);
            await tax.connect(addr1).transferFrom(owner.address, addr1.address, 3 * 10**18);
        })
    })
});