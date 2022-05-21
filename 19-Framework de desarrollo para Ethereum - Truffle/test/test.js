const ganache = artifacts.require("ganache");

contract("ganache", accounts => {
    console.log("Accounts: ", accounts);
    
    it('owner', async () => {
        let instance = await ganache.deployed();
        const _owner = await instance.owner.call();
        assert.equal(_owner, accounts[0]);
    })

    it("getMessage", async () =>{
        let instance = await ganache.deployed();
        const _getMessage = await instance.getMessage.call();
        assert.equal(_getMessage, "");
    })

    it("setMessage & getMessage", async () => {
        let instance = await ganache.deployed();
        const message = "Hi, my name is Joan Amengual";
        const _setMessage = await instance.setMessage(message, {from: accounts[0]});
        console.log("_setMessage: ", _setMessage);
        const _getMessage = await instance.getMessage.call();
        assert.equal(message, _getMessage);
    })

})