const { ethers } = require("ethers");

const provider = new ethers.providers.JsonRpcProvider(`http://127.0.0.1:7545`)

const account1 = '0x9fAac8E7b96e9f3D259e125874241E9783e94912'
const account2 = '0x6E302fdE93Fc3b33Be3651735D8416e7A5C4EB3a'
const privateKey1 = 'b96c1122cd8ffa847cba5e80ab5977bea2d5ec7da586f515163f706bbcadf4c8'

const wallet = new ethers.Wallet(privateKey1, provider)

const main = async () => {

    const senderBalanceBefore = await provider.getBalance(account1)
    console.log(`senderBalanceBefore: ${ethers.utils.formatEther(senderBalanceBefore)} ETH`)

    const recieverBalanceBefore = await provider.getBalance(account2)
    console.log(`recieverBalanceBefore: ${ethers.utils.formatEther(recieverBalanceBefore)} ETH`)

    const tx = await wallet.sendTransaction({
        to: account2,
        value: ethers.utils.parseEther("100")
    })

    await tx.wait()
    console.log(tx)

    const senderBalanceAfter = await provider.getBalance(account1)
    console.log(`senderBalanceAfter: ${ethers.utils.formatEther(senderBalanceAfter)} ETH`)
    const recieverBalanceAfter = await provider.getBalance(account2)
    console.log(`recieverBalanceAfter: ${ethers.utils.formatEther(recieverBalanceAfter)} ETH`)
}

main()