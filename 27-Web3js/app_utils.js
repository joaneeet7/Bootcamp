const Web3 = require("web3")
const web3 = new Web3("https://mainnet.infura.io/v3/78735446a0e74a1e8b64c290fa5d9e8e")


console.log("SHA3: ", web3.utils.sha3("Hi, Joan"))
console.log("Keccak256: ",web3.utils.keccak256("Hi, Joan"))
console.log("Solidity SHA3 (1 input): ",web3.utils.soliditySha3("Hi, Joan"))
console.log("Solidity SHA3 (2 inputs): ",web3.utils.soliditySha3("Hi, Joan", "Hi, George"))
console.log("Type & Value (1): ", web3.utils.soliditySha3(
            {type: 'string', value: 'Hi, Joan'},
            {type: 'string', value: 'Hi, George'}))
console.log("Type & Value (2): ", web3.utils.soliditySha3(
    {type: 'string', value: 'Hi, Joan'},
    {type: 'string', value: 'Hi, George'},
    {type: 'uint16', value: 0x3031}))
console.log("randomHex(0): ", web3.utils.randomHex(0))
console.log("randomHex(1): ", web3.utils.randomHex(1))
console.log("randomHex(32): ", web3.utils.randomHex(32))
console.log("isHex('0xc1912'): ", web3.utils.isHex('0xc1912'))
console.log("isHex('Hi, Joan'): ", web3.utils.isHex('Hi, Joan'))
console.log("isAddress('0xc1912fee45d61c87cc5ea59dae31190fffff232d'): ", 
            web3.utils.isAddress('0xc1912fee45d61c87cc5ea59dae31190fffff232d'))
console.log("isAddress('0xC1912fEE45d61C87Cc5EA59DaE31190FFFFf232d'): ", 
            web3.utils.isAddress('0xC1912fEE45d61C87Cc5EA59DaE31190FFFFf232d'))
console.log("hexToNumber('0xea'): ", web3.utils.hexToNumber('0xea'))
console.log("numberToHex(234): ", web3.utils.numberToHex(234))
console.log("hexToUtf8('0x49206861766520313030e282ac'): " ,web3.utils.hexToUtf8('0x49206861766520313030e282ac'))