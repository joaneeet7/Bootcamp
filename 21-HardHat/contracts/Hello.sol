//SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

import "hardhat/console.sol";

contract Hello {

    address public owner;
    string public message = "Hello World";

    constructor(){
        owner = msg.sender;
        console.log("Owner address:", msg.sender);
    }

    function getMessage() public view returns (string memory){
        return message;
    }
}