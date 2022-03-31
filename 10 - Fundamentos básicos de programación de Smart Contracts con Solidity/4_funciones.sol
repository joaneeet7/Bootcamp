// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract functions {
    // Pure  
    function getName() public pure returns (string memory){
        return "George/Joan";
    }
    // View 
    uint256 x = 100;
    function getNumber() public view returns (uint256){
        return x*2;
    }
    // Payable 
    struct wallet {
        string _name;
        address _address;
        uint256 _amount;
    }
    mapping (address => wallet) moneyWallet;
    event payment(string, address, uint256);
    function doPayment(string memory _name, uint256 _amount) public payable{
        wallet memory wallet1;
        wallet1 = wallet(_name, msg.sender, _amount);
        moneyWallet[msg.sender] = wallet1;
        // Emisor paga Ethers
        payable(msg.sender).transfer(_amount);
        emit payment (_name, msg.sender, _amount);
    }
    function getBalance() public view returns (wallet memory){
        return moneyWallet[msg.sender];
    }

}