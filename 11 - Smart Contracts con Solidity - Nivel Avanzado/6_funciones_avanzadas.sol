// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract Food {
    // Estructura de datos 
    struct dinnerPlate {
        string name;
        string ingredients;
    }
    // Menú del día
    dinnerPlate [] menu;

    // Creación de un nuevo menú 
    function newPlate (string memory _name, string memory _ingredients) internal {
        menu.push(dinnerPlate(_name, _ingredients));
    }
}

contract Hamburger is Food {
    address public owner;

    constructor () {
        owner = msg.sender;
    }

    // Cocinar una hamburguesa desde el Smart Contract principal
    function doHamburguer(string memory _ingredients, uint256 _units) external {
        require(_units <= 5, "Ups, please check the units of hamburgers!");
        newPlate("Hamburger", _ingredients);
    }

    // Función restringida al owner del Smart Contract
    function hashPrivateNumber(uint256 _number) public view onlyOwner returns (bytes32){
        return keccak256(abi.encodePacked(_number));
    }

    // Modifier para permitir el acceso al owner y sólo al owner
    modifier onlyOwner() {
        require(owner == msg.sender,"You do not have permissions to execute this function");
        _;
    }

}