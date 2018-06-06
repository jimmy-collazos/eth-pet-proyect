import web3 from './web3';
import CampaingFactory from './build/CampaingFactory.json';

const instance = new web3.eth.Contract(
  JSON.parse(CampaingFactory.interface),
  '0x3cfc83466930f8051dafbC391E5516d02F9b877e'
);

export default instance;