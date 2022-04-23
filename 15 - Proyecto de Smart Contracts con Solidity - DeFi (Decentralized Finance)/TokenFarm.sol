// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

import "./StellartToken.sol";
import "./JamToken.sol";

contract TokenFarm {

    // Declaraciones iniciales
    string public name = "Stellart Token Farm";
    address public owner;
    StellartToken public stellartToken;
    JamToken public jamToken;

    // Estructuras de datos
    address[] public stakers;
    mapping(address => uint) public stakingBalance;
    mapping(address => bool) public hasStaked;
    mapping(address => bool) public isStaking;

    // Constructor
    constructor(StellartToken _stellartToken, JamToken _jamToken) {
        stellartToken = _stellartToken;
        jamToken = _jamToken;
        owner = msg.sender;
    }

    // Hacer stake de tokens
    function stakeTokens(uint _amount) public {
        // Se requiere una cantidad superior a 0
        require(_amount > 0, "La cantidad no puede ser 0");

        //  Transferir tokens JAM Tokens a este contrato para staking
        jamToken.transferFrom(msg.sender, address(this), _amount);

        // Actualizar el saldo del staking
        stakingBalance[msg.sender] = stakingBalance[msg.sender] + _amount;

        // Añadir el usuario al array de stakers *solo* si no han hecho staking antes
        if(!hasStaked[msg.sender]) {
            stakers.push(msg.sender);
        }

        // Actualizar el estado del staking
        isStaking[msg.sender] = true;
        hasStaked[msg.sender] = true;
    }

    // Quitar el staking de los tokens (Withdraw)
    function unstakeTokens() public {
        // Saldo del staking
        uint balance = stakingBalance[msg.sender];

        // Se requiere una cantidad superior a 0
        require(balance > 0, "El balance de staking no puede ser 0");

        // Transferir tokens de JAM Tokens a este contrato para staking
        jamToken.transfer(msg.sender, balance);

        // Resetear el balance staking
        stakingBalance[msg.sender] = 0;

        // Actualizar el estado del staking
        isStaking[msg.sender] = false;
    }

    // Emision de Tokens
    function issueTokens() public {
        // Solo el propietario puede llamar a esta funcion
        require(msg.sender == owner, "No eres el Owner del Smart Contract");

        // Emitir tokens a todos los stakers
        for (uint i=0; i<stakers.length; i++) {
            address recipient = stakers[i];
            uint balance = stakingBalance[recipient];
            if(balance > 0) {
                stellartToken.transfer(recipient, balance);
            }
        }
    }
}
