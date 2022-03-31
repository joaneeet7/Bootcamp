// SPDX-License-Identifier: MIT

// Versión
pragma solidity ^0.8.0; // o pragma solidity >=0.6.0 <0.8.0;

// Importar un contrato inteligente desde Openzeppelin
import "@openzeppelin/contracts@4.4.2/token/ERC721/ERC721.sol";

// Declaración del Smart Contract
contract FirstContract is ERC721 {

    // Dirección de la persona que despliega el contrato
    address owner;

    /* Almacenamos en la variable "owner" la dirección de la persona 
    que despliega el contrato. */
    constructor(string memory _name, string memory _symbol) 
    ERC721(_name, _symbol){
        owner = msg.sender;
    }
}