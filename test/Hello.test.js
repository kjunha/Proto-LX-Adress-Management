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

    describe('minting', async () => {
        const regId = "reg1";
        let owner_addr;
        let owner;
        it('message passed successfully', async () => {
            const message = "Hello, World!";
            await contract.mint(message, regId);
            const result = await contract.getMessage(0);
            assert.equal(result, message);
        })
        it('token owner created', async () => {
            owner_addr = await contract.getOwnerAddress(regId);
            console.log(`Owner Address: ${owner_addr}`);
            assert.notEqual(owner_addr, '');
            assert.notEqual(owner_addr, 0x0);
            assert.notEqual(owner_addr, undefined);
            assert.notEqual(owner_addr, null);
            owner = await MessageOwner.at(owner_addr);
            assert.equal(await owner.getRegId(), regId);
        })
        it('token received', async () => {
            const balance = await contract.balanceOf(owner_addr);
            assert.equal(balance, 1);
        })

    })
})