const ganache = artifacts.require("ganache");

module.exports = function (deployer) {
  deployer.deploy(ganache);
};
