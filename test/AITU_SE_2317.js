const { expect } = require("chai");
const { ethers } = require("hardhat");


describe("AITU_SE_2317", function () {
  let My_token;
  let _mint;
  let owner;
  let addr1;
  let addr2;

  beforeEach(async function () {
    // Получаем фабрику контракта и подписчиков
    My_token = await ethers.getContractFactory("AITU_SE_2317");
    [owner, addr1, addr2] = await ethers.getSigners();
  
    // Разворачиваем контракт с начальной эмиссией в 1000 токенов
    _mint = await My_token.deploy("AITU_SE_2317", "SE_17", 1000);
  });
  
  

  describe("Deployment", function () {
    it("Should set the correct name and symbol", async function () {
      expect(await _mint.name()).to.equal("AITU_SE_2317");
      expect(await _mint.symbol()).to.equal("SE_17");
    });

    it("Should mint the initial supply to the deployer", async function () {
      expect(await _mint.balanceOf(owner.address)).to.equal(1000);
    });
  });

  describe("Transactions", function () {
    it("Should log transactions and update balances", async function () {
      // Transfer 100 tokens from owner to addr1
      await _mint.transfer(addr1.address, 100);
    
      // Check balances
      expect(await _mint.balanceOf(owner.address)).to.equal(900);
      expect(await _mint.balanceOf(addr1.address)).to.equal(100);
    
      // Check transaction details
      const [sender, receiver, amount, timestamp] = await _mint.getLatestTransactionDetails();
      expect(sender).to.equal(owner.address);
      expect(receiver).to.equal(addr1.address);
      expect(amount).to.equal(100);
      expect(timestamp).to.be.gt(0); // Ensure timestamp is positive
    });
    

    it("Should fail if sender has insufficient balance", async function () {
      // Attempt to transfer more tokens than the owner has
      await expect(_mint.transfer(addr1.address, 1001)).to.be.revertedWithCustomError(_mint, "ERC20InsufficientBalance");
    });

    it("Should fail if recipient address is invalid", async function () {
      // Attempt to transfer to the zero address
      await expect(_mint.transfer(ethers.ZeroAddress, 100)).to.be.revertedWithCustomError(_mint, "ERC20TransferToTheZeroAddress");
    });
  });

  describe("Transaction Logging", function () {
    it("Should log multiple transactions correctly", async function () {
      // Transfer 100 tokens from owner to addr1
      await _mint.transfer(addr1.address, 100);

      // Transfer 200 tokens from owner to addr2
      await _mint.transfer(addr2.address, 200);

      // Check the latest transaction details
      const [sender, receiver, amount, timestamp] = await _mint.getLatestTransactionDetails();
      expect(sender).to.equal(owner.address);
      expect(receiver).to.equal(addr2.address);
      expect(amount).to.equal(200);
      expect(timestamp).to.be.gt(0);
    });
  });
});
