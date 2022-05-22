const customERC20 = artifacts.require("customERC20");

module.exports = function (deployer) {
  deployer.deploy(customERC20, "Joan", "JA");
};
