const { ethers } = require("ethers");

const INFURA_ID = '7c9cd8b7cd234cbdbcc5f2ab4b55a514'
const provider = new ethers.providers.JsonRpcProvider(`https://mainnet.infura.io/v3/${INFURA_ID}`)

const main = async () => {

    const block = await provider.getBlockNumber()
    console.log(`\nBlock number: ${block}`)

    const blockInfo = await provider.getBlock(block)
    console.log(blockInfo)

    const {transactions} = await provider.getBlockWithTransactions(block)
    console.log(transactions[0])
}

main()