const Hello = artifacts.require("./Hello");
require('chai').use(require('chai-as-promised')).should();
contract("Hello", (accounts) => {
    let contract
    before(async () => {
        contract = await Hello.deployed()
    })

    describe('deployment', async () => {
        it('deployes successfully', async() => {
            const address = contract.address;
            console.log(address)
            assert.notEqual(address, '')
            assert.notEqual(address, 0x0)
            assert.notEqual(address, undefined)
            assert.notEqual(address, null)
        })

        it('name initialized', async() => {
            const name = await contract.name();
            assert.equal(name, "steve");
        })
    })

    describe('updating', async () => {
        it('update name', async() => {
            await contract.setName("junha");
            const newName = await contract.name();
            assert.equal(newName, "junha");
        })
    })
})