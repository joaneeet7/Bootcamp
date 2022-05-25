const { ethers } = require("ethers");

const provider = new ethers.providers.JsonRpcProvider(`http://127.0.0.1:7545`)

const account1 = '0x9fAac8E7b96e9f3D259e125874241E9783e94912'
const account2 = '0x6E302fdE93Fc3b33Be3651735D8416e7A5C4EB3a'
const privateKey1 = 'b96c1122cd8ffa847cba5e80ab5977bea2d5ec7da586f515163f706bbcadf4c8'

const wallet = new ethers.Wallet(privateKey1, provider)

const ERC20_ABI = [
    "function decimals() view returns (uint)",
    "function balanceOf(address) view returns (uint)",
    "function transfer(address to, uint amount) returns (bool)",
];

const address = '0xd229DA90D88333017C90Fb58a50414471553F127'
const contract = new ethers.Contract(address, ERC20_ABI, provider)

const main = async () => {

    const decimals = await contract.decimals()
    console.log(`Decimals: ${decimals}`)
    const balanceBefore = await contract.balanceOf(account1)
    console.log(`BalanceBefore (${account1}): ${balanceBefore / 10**decimals} Tokens`)

    const contractWithWallet = contract.connect(wallet)
    const tx = await contractWithWallet.transfer(account2, balanceBefore)
    await tx.wait()
    console.log(tx)

    const balanceAfter = await contract.balanceOf(account1)
    console.log(`balanceAfter (${account1}): ${balanceAfter / 10**decimals} Tokens`)
    const balanceAccount2 = await contract.balanceOf(account2)
    console.log(`balanceAccount2 (${account2}): ${balanceAccount2 / 10**decimals} Tokens`)
}

main()

