const art = artifacts.require("art");

contract('art', accounts => {
    console.log('Accounts: ', accounts);
    it('name test', async () => {
        let instance = await art.deployed();
        const _setMessage = await instance.setMessage('Hi, my name is Joan.', { from: accounts[0] });
        console.log('_setMessage', _setMessage);
        const _getMessage = await instance.getMessage.call();
        assert.equal(_getMessage, 'Hi, my name is Joan.');
    });
});