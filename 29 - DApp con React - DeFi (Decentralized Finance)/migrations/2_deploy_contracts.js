const StellartToken = artifacts.require('StellartToken')
const DaiToken = artifacts.require('DaiToken')
const TokenFarm = artifacts.require('TokenFarm')

module.exports = async function(deployer, network, accounts) {
  
  // Despliegue del Mock DAI Token
  await deployer.deploy(DaiToken)
  const daiToken = await DaiToken.deployed()

  // Despliegue del Stellart Token
  await deployer.deploy(StellartToken)
  const stellartToken = await StellartToken.deployed()

  // Despliegue del TokenFarm
  await deployer.deploy(TokenFarm, stellartToken.address, daiToken.address)
  const tokenFarm = await TokenFarm.deployed()

  // Transferir todos los tokens a TokenFarm (1 millon de tokens)
  await stellartToken.transfer(tokenFarm.address, '1000000000000000000000000')

  // Transferencia de 100 tokens Mock DAI al inversor
  await daiToken.transfer(accounts[1], '100000000000000000000')
}
