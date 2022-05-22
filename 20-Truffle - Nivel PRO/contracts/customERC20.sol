// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;
import "./ERC20.sol";

contract customERC20 is ERC20 {

    // Constructor del Smart Contract
    constructor(string memory _name, string memory _symbol) 
    ERC20(_name, _symbol) {}

    // Creacion de nuevos Tokens
    function crearTokens() public {
        _mint(msg.sender, 1000);
    }

    // Destruir Tokens
    function destruirTokens(address _account, uint _amount) public {
        _burn(_account, _amount);
    }
}
