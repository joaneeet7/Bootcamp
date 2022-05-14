// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

/* ¿fallback() y receive()?

msg.data -> El calldata completo, que es un area no modificable y no persistente 
            en la que se almacenan los argumentos de la funcion y que se comporta 
            principalmente como la memoria.

    Ether enviado al Smart Contract
                    |
              ¿msg.data vacio?
                /            \
               si            no
               /               \
       ¿existe receive()?     fallback()
           /       \
          si       no
          /          \
      receive()   fallback()
*/

contract Fallback_Receive {

    event log(string _name, address _sender, uint _amount, bytes _data);

    fallback() external payable {
        emit log("fallback", msg.sender, msg.value, msg.data);
    }

    receive() external payable {
        emit log("receive", msg.sender, msg.value, "");
    }
}

