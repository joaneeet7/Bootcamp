// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract variables_modifiers {
    // Valores enteros sin signos (uint)
    uint256 a;
    uint256 b = 3;

    // Valores enteros con signo (int)
    int256 c;
    int256 d = -32;
    int256 e = 65;

    // Variable string
    string str;
    string public str_public = "This is public";
    string private str_private = "This is private";

    // Variable booleana
    bool boolean;
    bool public boolean_true = true;
    bool public boolean_false = false;

    // Variable bytes
    bytes32 first_bytes;
    bytes4 second_bytes;
    bytes32 public hashing = keccak256(abi.encodePacked("Hi"));

    // Variable address
    address my_address;
    address public address1 = 0xAb8483F64d9C6d1EcF9b849Ae677dD3315835cb2;
    address public address2 = msg.sender;

    // Variable de enumeración
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