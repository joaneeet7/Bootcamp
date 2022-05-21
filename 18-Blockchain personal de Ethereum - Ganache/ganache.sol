// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

contract ganache {

    // Direccion del propietario del Smart Contract
    address public owner;

    // Direccion del Smart Contract
    address public smartContract;

    // Declaracion del mensaje
    string message = "";

    // Evento de construccion del Smart Contract
    event newContract(address owner, address smartContract);

    // Evento de publicacion del mensaje
    event newMessage(string message);

    // Constructor 
    constructor(){
        owner = msg.sender;
        smartContract = address(this);
        emit newContract(owner, smartContract);
    }

    // Publicar un mensaje a la Blockchain
    function setMessage(string memory _message) public {
        message = _message;
        emit newMessage(message);
    }

    // Visualizar el mensaje de la Blockchain
    function getMessage() public view returns (string memory){
        return message;
    }

}