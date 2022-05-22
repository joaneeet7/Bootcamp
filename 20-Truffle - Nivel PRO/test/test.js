const customERC20 = artifacts.require("customERC20");

contract("customERC20", accounts => {
    console.log("Accounts: ", accounts);

    it("name", async () => {
        let instance = await customERC20.deployed();

        let _name = await instance.name.call();
        assert.equal(_name, "Joan");
    });

    it("symbol", async () => {
        let instance = await customERC20.deployed();

        let _symbol = await instance.symbol.call();
        assert.equal(_symbol, "JA");
    });

    it("decimals", async () => {
        let instance = await customERC20.deployed();

        let _decimals = await instance.decimals.call();
        assert.equal(_decimals, 18);
    });


    it('newTokens', async () => {
        let instance = await customERC20.deployed();

        let _initial_supply = await instance.totalSupply.call();
        assert.equal(_initial_supply, 0);

        await instance.crearTokens();

        let _supply = await instance.totalSupply.call();
        assert.equal(_supply, 1000);

        let _balance = await instance.balanceOf.call(accounts[0]);
        assert.equal(_balance, 1000);
    });

    it("transfer", async () => {
        let instance = await customERC20.deployed();

        await instance.transfer(accounts[1], 10, {from: accounts[0]});

        let _balance0 = await instance.balanceOf.call(accounts[0]);
        assert.equal(_balance0, 1000 - 10);

        let _balance1 = await instance.balanceOf.call(accounts[1]);
        assert.equal(_balance1, 10);
    });


    it("approve, allowance & transferFrom", async () => {
        let instance = await customERC20.deployed();

        let _initial_allowance = await instance.allowance(accounts[0], accounts[1]);
        assert.equal(_initial_allowance, 0);

        await instance.approve(accounts[1], 100, {from: accounts[0]});
        let _current_allowance = await instance.allowance(accounts[0], accounts[1]);
        assert.equal(_current_allowance, 100);

        let _balance1 = await instance.balanceOf.call(accounts[1]);
        assert.equal(_balance1, 10);

        await instance.transferFrom(accounts[0], accounts[2], 100, {from: accounts[1]});

        let _allowance_after_transfer = await instance.allowance(accounts[0], accounts[1]);
        assert.equal(_allowance_after_transfer, 0);

        let _balance2 = await instance.balanceOf.call(accounts[2]);
        assert.equal(_balance2, 100);
    });

    it("increaseAllowance & decreaseAllowance", async() => {
        let instance = await customERC20.deployed();

        addr = accounts[4];

        await instance.approve(addr, 100, {from: accounts[0]});
        let _allowance5 = await instance.allowance(accounts[0], addr);
        assert.equal(_allowance5, 100);

        await instance.increaseAllowance(addr, 200);

        let _allowance5_200 = await instance.allowance(accounts[0], addr);
        assert.equal(_allowance5_200, 100 + 200);

        await instance.decreaseAllowance(addr, 50);

        let _allowance5_250 = await instance.allowance(accounts[0], addr);
        assert.equal(_allowance5_250, 100 + 200 - 50);
    });

    it("burn", async () => {
        let instance = await customERC20.deployed();

        let _total_balance = await instance.balanceOf(accounts[0]);
        await instance.destruirTokens(accounts[0], _total_balance);
        let _total_balance2 = await instance.balanceOf(accounts[0]);
        assert.equal(_total_balance2, 0);
    });


})