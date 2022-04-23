// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

contract padre {

    // Almacenamiento de la información del Factory
    mapping (address => address) public personal_contract;

    // Emisión de los nuevos contratos inteligentes 
    function Factory() public {
        address addr_personal_contract = address(new hijo(msg.sender));
        personal_contract[msg.sender] = addr_personal_contract;
    }
}

// Smart Contracts (hijos) generados por el padre
contract hijo {

    // Datos recibidos al nuevo Smart Contract
    constructor (address _account){
        propietario._owner = _account;
        propietario._smartcontractPadre = address(this);
    }

    // Estructuras de datos del propietario
    Owner public propietario;
    struct Owner {
        address _owner;
        address _smartcontractPadre;
    }
}