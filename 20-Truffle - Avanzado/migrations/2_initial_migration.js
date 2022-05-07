const art = artifacts.require("art");

module.exports = function (deployer) {
  deployer.deploy(art, "MyNFT", "JA");
};
