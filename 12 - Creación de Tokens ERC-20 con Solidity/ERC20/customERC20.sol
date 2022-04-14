// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;
import "./ERC20.sol";

contract customERC20 is ERC20 {
    constructor() ERC20("Joan", "JA") {}

    function crearTokens() public {
        _mint(address(this), 1000);
    }
}

