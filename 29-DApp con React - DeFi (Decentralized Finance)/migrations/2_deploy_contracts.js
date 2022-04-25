const StellartToken = artifacts.require('StellartToken')
const JamToken = artifacts.require('JamToken')
const TokenFarm = artifacts.require('TokenFarm')

module.exports = async function(deployer, network, accounts) {
  
  // Despliegue del jamToken 
  await deployer.deploy(JamToken)
  const jamToken = await JamToken.deployed()

  // Despliegue del Stellart Token
  await deployer.deploy(StellartToken)
  const stellartToken = await StellartToken.deployed()

  // Despliegue del TokenFarm
  await deployer.deploy(TokenFarm, stellartToken.address, jamToken.address)
  const tokenFarm = await TokenFarm.deployed()

  // Transferir todos los tokens a TokenFarm (1 millon de tokens)
  await stellartToken.transfer(tokenFarm.address, '1000000000000000000000000')

  // Transferencia de 100 jamTokes al inversor
  await jamToken.transfer(accounts[1], '100000000000000000000')
}
