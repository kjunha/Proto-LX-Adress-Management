const ServiceHost = artifacts.require("./ServiceHost");
const Client = artifacts.require("./Client");
const TruffleAssert = require("truffle-assertions")
require('chai').use(require('chai-as-promised')).should();
contract("ServiceHost", (accounts) => {
    let contract
    before(async () => {
        contract = await ServiceHost.deployed()
    })

    describe('deployment', async () => {
        it('deployes successfully', async () => {
            const address = contract.address;
            console.log(address)
            assert.notEqual(address, '')
            assert.notEqual(address, 0x0)
            assert.notEqual(address, undefined)
            assert.notEqual(address, null)
        })
    })

    describe('register a client', async () => {
        const name = "user1";
        const residence = "Seoul"
        let client_addr;
        let client;
        let transaction;
        it('client successfully registered', async () => {
            transaction = await contract.signup(name, residence);
            client_addr = await contract.getClientAddress(name);
            console.log(`Owner Address: ${client_addr}`);
            assert.notEqual(client_addr, '');
            assert.notEqual(client_addr, 0x0);
            assert.notEqual(client_addr, undefined);
            assert.notEqual(client_addr, null);
            client = await Client.at(client_addr);
            const {0: reg_name, 1: reg_addr} = await client.getInfo();
            assert.equal(reg_name, name);
            assert.equal(reg_addr, residence);
        })

        it('[--event] register new client emitted, update address emitted', async () => {
            TruffleAssert.eventEmitted(transaction, 'RegisterNewClient', (event) => {
                return event.name == name && event.residence == residence
            })
            const innerTx = await TruffleAssert.createTransactionResult(client, transaction.tx)
            TruffleAssert.eventEmitted(innerTx, 'UpdateResidentialAddress', (event) => {
                return event.residence == residence
            })
        })

        it('host can access anytime', async() => {
            const {0: reg_name, 1: reg_addr} = await client.getInfo();
            assert.equal(reg_name, name);
            assert.equal(reg_addr, residence);
        })

        it('unregistered node cannot access', async() => {
            const {0: reg_name, 1: reg_addr} = await client.getInfo({from: accounts[1]});
            assert.notEqual(reg_name, name);
            assert.notEqual(reg_addr, residence);
        })

        it('registered node can access', async() => {
            await client.register(accounts[2]);
            const {0: reg_name, 1: reg_addr} = await client.getInfo({from: accounts[2]});
            assert.equal(reg_name, name);
            assert.equal(reg_addr, residence);
        })

        it('deregistered node cannot access', async() => {
            await client.deregister(accounts[2]);
            const {0: reg_name, 1: reg_addr} = await client.getInfo({from: accounts[2]});
            assert.notEqual(reg_name, name);
            assert.notEqual(reg_addr, residence);
        })
    })

    describe('update client information', async() => {
        const name = "user1";
        const residence = "Seoul 123"
        let client_addr;
        let client;
        let serviceHostTx;

        it('client address successfully updated', async () => {
            serviceHostTx = await contract.signup(name, residence);
            client_addr = await contract.getClientAddress(name);
            client = await Client.at(client_addr);
            const {0: reg_name, 1: reg_addr} = await client.getInfo();
            assert.equal(reg_name, name);
            assert.equal(reg_addr, residence);
        })

        it('[--event] register new client not emitted, update address emitted', async () => {
            TruffleAssert.eventNotEmitted(serviceHostTx, 'RegisterNewClient')
            const clientTx = await TruffleAssert.createTransactionResult(client, serviceHostTx.tx)
            TruffleAssert.eventEmitted(clientTx, 'UpdateResidentialAddress', (event) => {
                return event.residence == residence
            })
        })

        it('[--event] event only emitted when the address is new', async () => {
            serviceHostTx = await contract.signup(name, residence);
            const clientTx = await TruffleAssert.createTransactionResult(client, serviceHostTx.tx)
            TruffleAssert.eventNotEmitted(clientTx, 'UpdateResidentialAddress')
        })
    })
})