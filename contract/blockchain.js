const Web3 = require("web3");

const candycaneContractAddress = require("../migrate.json").addresses[1];
const candycaneContractABI =
  require("../../token/client/src/contracts/CandyCane.json").abi;
const nftContractAddress = require("../migrate.json").addresses[2];
const nftContractABI =
  require("../../token/client/src/contracts/nftContract.json").abi;

const infuraURL =
  "https://polygon-mumbai.infura.io/v3/83dabe84d2a64e78b6622fbe13bf7a06";

const provider = new Web3.providers.HttpProvider(infuraURL);

const web3 = new Web3(provider);

const nftContract = new web3.eth.Contract(nftContractABI, nftContractAddress);
const candycaneContract = new web3.eth.Contract(
  candycaneContractABI,
  candycaneContractAddress
);

const maxNFTNumber = 200;

async function getRandomNFTNumber() {
  let found = undefined;

  let registeredNFTS = await nftContract.methods.getRegisteredNFTS().call();

  for (let i = 0; i < maxNFTNumber; i++) {
    let isRegistered = false;
    registeredNFTS.forEach((nft) => {
      if (nft.tokenNumber == i) {
        isRegistered = true;
      }
    });

    if (!isRegistered) {
      found = i;
    }
  }

  return found;
}

async function mintNFT(address) {}

module.exports = {
  nftContract,
  candycaneContract,
  web3,
  getRandomNFTNumber,
  mintNFT,
};
