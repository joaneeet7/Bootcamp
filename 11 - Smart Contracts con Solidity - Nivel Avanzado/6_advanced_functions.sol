// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract Food {
    // Data structure 
    struct dinnerPlate {
        string name;
        string ingredients;
    }
    // Menu of the day
    dinnerPlate [] menu;

    // Function to create a new menu 
    function newPlate (string memory _name, string memory _ingredients) internal {
        menu.push(dinnerPlate(_name, _ingredients));
    }
}

contract Hamburger is Food {
    address public owner;

    constructor () {
        owner = msg.sender;
    }

    // Cooking a hamburger from the main contract
    function doHamburguer(string memory _ingredients, uint256 _units) external {
        require(_units <= 5, "Ups, please check the units of hamburgers!");
        newPlate("Hamburger", _ingredients);
    }

    // Function restricted to Smart Contract owner
    function hashPrivateNumber(uint256 _number) public view onlyOwner returns (bytes32){
        return keccak256(abi.encodePacked(_number));
    }

    // Modifier to allow access to the owner and only to the owner
    modifier onlyOwner() {
        require(owner == msg.sender,"You do not have permissions to execute this function");
        _;
    }

}