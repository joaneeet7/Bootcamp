const TokenFarm = artifacts.require('TokenFarm')

module.exports = async function(callback) {
    let tokenFarm = await TokenFarm.deployed()
    await tokenFarm.issueTokens()
    // El codigo va aqui
    console.log('Tokens emitidos!')
    callback()
}