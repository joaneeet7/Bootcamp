const ganache = artifacts.require("ganache");

contract('ganache', accounts => {
    console.log('Accounts: ', accounts);
    it('owner', async () => {
        let instance = await ganache.deployed();
        const _owner = await instance.owner.call();
        assert.equal(_owner, accounts[0]);
    });

    it('1. setMessage & getMessage', async () => {
        let instance = await ganache.deployed();
        const _getMessage = await instance.getMessage.call();
        assert.equal(_getMessage, '');
    });

    it('2. setMessage & getMessage', async () => {
        let instance = await ganache.deployed();
        const _setMessage = await instance.setMessage('Hi, my name is Joan.', { from: accounts[0] });
        console.log('_setMessage', _setMessage);
        const _getMessage = await instance.getMessage.call();
        assert.equal(_getMessage, 'Hi, my name is Joan.');
    });
});