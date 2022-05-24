const Web3 = require("web3")
const web3 = new Web3("https://mainnet.infura.io/v3/78735446a0e74a1e8b64c290fa5d9e8e")

web3.eth.getBlock("latest").then((block) => {
    console.log(block)
})

web3.eth.getBlock("14835968").then((block) => {
    console.log({blockHash: block.hash,
                blockNumber: block.number,
                nonce: block.nonce})
})

web3.eth.getBlockNumber().then((latest) => {
    for (let i = 0; i < 10; i++){
        web3.eth.getBlock(latest - i).then((block) => {
                console.log({blockHash: block.hash,
                            blockNumber: block.number,
                            nonce: block.nonce})
                })
    }
})

web3.eth.getBlock("latest").then(console.log)