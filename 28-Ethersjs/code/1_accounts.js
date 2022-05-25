const { ethers } = require("ethers");

const INFURA_ID = '7c9cd8b7cd234cbdbcc5f2ab4b55a514'
const provider = new ethers.providers.JsonRpcProvider(`https://mainnet.infura.io/v3/${INFURA_ID}`)

const address = '0x4Ddc2D193948926D02f9B1fE9e1daa0718270ED5'

const main = async () => {

    const balance = await provider.getBalance(address)
    console.log(`\nETH Balance (${address}) --> ${ethers.utils.formatEther(balance)} ETH\n`)
}

main()