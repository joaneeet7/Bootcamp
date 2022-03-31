// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract variables_modifiers {
    // Integer values without signs (uint)
    uint256 a;
    uint256 b = 3;

    // Integer values with signs (int)
    int256 c;
    int256 d = -32;
    int256 e = 65;

    // String variables
    string str;
    string public str_public = "This is public";
    string private str_private = "This is private";

    // Boolean variables
    bool boolean;
    bool public boolean_true = true;
    bool public boolean_false = false;

    // Bytes variables
    bytes32 first_bytes;
    bytes4 second_bytes;
    bytes32 public hashing = keccak256(abi.encodePacked("Hi"));

    // Address variables
    address my_address;
    address public address1 = 0xAb8483F64d9C6d1EcF9b849Ae677dD3315835cb2;
    address public address2 = msg.sender;

    // Enumeration variable
    enum options {ON, OFF}
    options state;
    options constant defaultChoice = options.OFF;

    function turnOn() public {
        state = options.ON;
    }

    function turnOff() public {
        state = options.OFF;
    }

    function displayState() public view returns (options){
        return state;
    }

}