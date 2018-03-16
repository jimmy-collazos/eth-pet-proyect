const HDWalletProvider = require('truffle-hdwallet-provider');
const Web3 = require('web3');

const compiledFactory = require('./build/CampaingFactory.json');

const provider = new HDWalletProvider(
  'candy maple cake sugar pudding cream honey rich smooth crumble sweet treat', // put your Memo token
  'https://rinkeby.infura.io/Cq3gihQ99fvQZjZILYKs'
);
const web3 = new Web3(provider);

const deploy = async () => {
  const accounts = await web3.eth.getAccounts();
  console.log('Attenpting to deploy from account', accounts[0]);

  const result = await new web3.eth.Contract(JSON.parse(compiledFactory.interface))
    .deploy({data: compiledFactory.bytecode}) 
    .send({ from: accounts[0], gas: '1000000' });

  console.log('Contract deployed to', result.options.address);
}

deploy();
