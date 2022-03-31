// SPDX-License-Identifier: MIT

// Version
pragma solidity ^0.8.0; // or pragma solidity >=0.6.0 <0.8.0;

// Importing a Smart Contract from Openzeppelin
import "@openzeppelin/contracts@4.4.2/token/ERC721/ERC721.sol";

// Smart contract statement
contract FirstContract is ERC721 {

    // Address of the person deploying the contract
    address owner;

    /* We store in the owner variable the address of the person 
    who deploys the contract. */
    constructor(string memory _name, string memory _symbol) 
    ERC721(_name, _symbol){
        owner = msg.sender;
    }
}