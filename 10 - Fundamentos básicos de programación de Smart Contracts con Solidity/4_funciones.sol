// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

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

    // Estructura de datos para relacionar un usuario y su wallet
    mapping (address => wallet) moneyWallet;

    // Evento de pago realizado
    event payment(string, address, uint256);

    // Realizacion de un pago
    function doPayment(string memory _name, uint256 _amount) public payable{
        wallet memory wallet1;
        wallet1 = wallet(_name, msg.sender, _amount);
        moneyWallet[msg.sender] = wallet1;
        payable(msg.sender).transfer(_amount);
        emit payment (_name, msg.sender, _amount);
    }

    // Obtencion del balance de la wallet
    function getBalance() public view returns (wallet memory){
        return moneyWallet[msg.sender];
    }

}