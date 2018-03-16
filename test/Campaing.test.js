const assert = require("assert");
const ganache = require("ganache-cli");
const Web3 = require("web3");
const web3 = new Web3(ganache.provider());

const compileFactory = require("../ethereum/build/CampaingFactory.json");
const compileCampaing = require("../ethereum/build/Campaing.json");

let accounts;
let factory;
let campaingAddress;
let campaing;
let minimunContribution;

beforeEach(async () => {
  accounts = await web3.eth.getAccounts();
  factory = await new web3.eth.Contract(JSON.parse(compileFactory.interface))
    .deploy({ data: compileFactory.bytecode })
    .send({ from: accounts[0], gas: "1000000" });

  await factory.methods.createCampaing("100").send({
    from: accounts[0],
    gas: "1000000"
  });

  [campaingAddress] = await factory.methods.getDeployedCampaigns().call();

  campaing = await new web3.eth.Contract(
    JSON.parse(compileCampaing.interface),
    campaingAddress
  );
});

describe("Campaing", () => {
  it("deploy a factory and a campaing", () => {
    assert.ok(factory.options.address);
    assert.ok(campaing.options.address);
  });
  it("marks acaller as the campaing manager", async () => {
    const manager = await campaing.methods.manager().call();
    assert.ok(accounts[0], manager);
  });
  it("allows people to contribute money and marks then as approvers", async () => {
    await campaing.methods.contribute().send({
      value: "200",
      from: accounts[1]
    });

    const isContributor = await campaing.methods.approvers(accounts[1]).call();
    assert(isContributor);
  });
  it("require a minimun contribution", async () => {
    const minimunContrbution = await campaing.methods
      .mininumContribution()
      .call();
    try {
      campaing.methods.contribute().send({
        value: (minimunContrbution - 1).toString(),
        from: accounts[1]
      });
      assert(false);
    } catch (e) {
      assert(true);
    }
  });
  it('allow a manager to make a payment request', async () => {
    await campaing.methods.createRequest('Buy battery', '100', accounts[1]).send({
      gas: "1000000",
      from: accounts[0]
    });

    const request = await campaing.methods.requests(0).call();

    assert.equal('Buy battery', request.description);
  });

  it('processes requests', async () => {
    await campaing.methods.contribute().send({
      from: accounts[0],
      value: web3.utils.toWei('10', 'ether')
    });

    await campaing.methods
      .createRequest('A', web3.utils.toWei('5', 'ether'), accounts[1])
      .send({
        from: accounts[0], gas: '1000000'
      });
    
    await campaing.methods
      .approveRequest(0)
      .send({
        from: accounts[0],
        gas: '1000000'
      });

    await campaing.methods
      .finalizeRequest(0)
      .send({
        from: accounts[0],
        gas: '1000000'
      });

    let balance = await web3.eth.getBalance(accounts[1]);
    balance = web3.utils.fromWei(balance, 'ether');
    balance = parseFloat(balance);
    assert(balance > 104)
  });
});
