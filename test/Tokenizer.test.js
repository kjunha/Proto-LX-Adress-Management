const Tokenizer = artifacts.require("./Tokenizer");
const MessageOwner = artifacts.require("./MessageOwner");
require('chai').use(require('chai-as-promised')).should();
contract("Tokenizer", (accounts) => {
    let contract
    before(async () => {
        contract = await Tokenizer.deployed()
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

    describe('register an user', async () => {
        const name = "user1";
        const residence = "Seoul"
        let user_addr;
        let user;
        it('user successfully registered', async () => {
            await contract.signup(name, residence);
            user_addr = await contract.getOwnerAddress(name);
            console.log(`Owner Address: ${user_addr}`);
            assert.notEqual(user_addr, '');
            assert.notEqual(user_addr, 0x0);
            assert.notEqual(user_addr, undefined);
            assert.notEqual(user_addr, null);
            user = await MessageOwner.at(user_addr);
            const {0: reg_name, 1: reg_addr} = await user.getInfo();
            assert.equal(reg_name, name);
            assert.equal(reg_addr, residence);
        })

        it('host can access anytime', async() => {
            const {0: reg_name, 1: reg_addr} = await user.getInfo();
            assert.equal(reg_name, name);
            assert.equal(reg_addr, residence);
        })

        it('unregistered node cannot access', async() => {
            const {0: reg_name, 1: reg_addr} = await user.getInfo({from: accounts[1]});
            assert.notEqual(reg_name, name);
            assert.notEqual(reg_addr, residence);
        })

        it('registered node can access', async() => {
            await user.register(accounts[2]);
            const {0: reg_name, 1: reg_addr} = await user.getInfo({from: accounts[2]});
            assert.equal(reg_name, name);
            assert.equal(reg_addr, residence);
        })

        it('deregistered node cannot access', async() => {
            await user.deregister(accounts[2]);
            const {0: reg_name, 1: reg_addr} = await user.getInfo({from: accounts[2]});
            assert.notEqual(reg_name, name);
            assert.notEqual(reg_addr, residence);
        })
    })

    describe('update user information', async() => {
        const name = "user1";
        const residence = "Seoul 123"
        let user_addr;
        let user;
        it('user address successfully updated', async () => {
            await contract.signup(name, residence);
            user_addr = await contract.getOwnerAddress(name);
            user = await MessageOwner.at(user_addr);
            const {0: reg_name, 1: reg_addr} = await user.getInfo();
            assert.equal(reg_name, name);
            assert.equal(reg_addr, residence);
        })
    })
})