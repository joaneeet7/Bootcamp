const loteria = artifacts.require("loteria");

module.exports = function(deployer) {
  deployer.deploy(loteria);
};
