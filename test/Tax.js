const { expect } = require ('chai');
const { artifacts } = require('hardhat');
//const { ethers } = require('ethers');
//const { isCallTrace } = require('hardhat/internal/hardhat-network/stack-traces/message-trace');


// To use the NFT contract in the token contract, modify the constructor to get the sc address of NFT as argument.
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
            decim = 18;
            exp = ethers.BigNumber.from("10").pow(decim);
            amount = ethers.BigNumber.from("3").mul(exp);
            await tax.approve(addr1.address, amount);
            await tax.connect(addr1).transferFrom(owner.address, addr1.address, amount);
        })
    })
});

describe('NFT', function() {
    beforeEach(async function() {
        NFT = await ethers.getContractFactory("NFT");
        nft = await NFT.deploy();
        await nft.deployed();
    });

    describe("Deployment", function() {
        it("Should be the correct name", async function () {
            expect(await nft.name()).to.equal("OneRing");
        });

        it("Should be the correct symbol", async function () {
            expect(await nft.symbol()).to.equal("ONE");
        })
    });
})

// To modify for new ruler contract
describe('Ruler', function() {
    beforeEach(async function() {
        // let provider = ethers.getDefaultProvider();
        // //NFT = await ethers.getContractAt("RING");
        // ringArtifact = await artifacts.readArtifact("NFT");
        // taxArtifact = await artifacts.readArtifact("Tax");
        // _ring = new ethers.Contract("NFT", ringArtifact.abi, provider);
        // rad = _ring.address;
        // _tax = new ethers.Contract("Tax", taxArtifact.abi, provider)
        Token = await ethers.getContractFactory("Tax");
        tax = await Token.deploy(2, 3);
        await tax.deployed();

        NFT = await ethers.getContractFactory("NFT");
        nft = await NFT.deploy();
        await nft.deployed();

        Ruler = await ethers.getContractFactory("Ruler");
        //ring = await _ring.deployed();
        console.log("Ring address is: %s", nft.address);
        ruler = await Ruler.deploy(nft.address, tax.address);
        
        let balance;
        let total;
        [own, add1, add2, ...addrs] = await ethers.getSigners();
        
    });

    describe("Deployment", function() {
        it("Only 1 token", async function () {
            await nft.createRing();
            total = nft.maxSupply();
            console.log("total is: %s", total);
            //expect(await total).to.equal(1);
        });
        it("Only one token in balance", async function () {
            await nft.createRing();
            balance = await nft.balanceOf(own.address);
            //console.log("balance of owner is: %s", balance);
            expect(await nft.balanceOf(own.address)).to.equal(1);
        });
    })
})