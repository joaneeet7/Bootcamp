// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

contract data_structures {

    // Estructura de datos de un cliente 
    struct Customer {
        uint256 id;
        string name;
        string email;
    }

    // Variable de tipo cliente
    Customer customer_1 = Customer(1, "Joan", "joan@gmail.com");

    // Array de uints de longitud fija 
    uint256 [5] public fixed_list_uints = [1,2,3,4,5];

    // Array dinamico de uints 
    uint256 [] dynamic_list_uints;

    // Array dinamico de tipo cliente 
    Customer [] public dynamic_list_customer;

    // Nuevos datos en un array
    function array_modification (uint256 _id, string memory _name, string memory _email) public {
        Customer memory random_customer = Customer(_id, _name, _email);
        dynamic_list_customer.push(random_customer);
    }

    // Mappings 
    mapping (address => uint256) public address_uint;
    mapping (string => uint256 []) public string_listUnits;
    mapping (address => Customer) public address_dataStructure;

    // Asignar un numero a una direccion 
    function assignNumber (uint256 _number) public {
        address_uint[msg.sender] = _number;
    }

    // Asignar varios numeros a una direcion
    function assignList (string memory _name, uint256 _number) public {
        string_listUnits[_name].push(_number);
    }

    // Asignacion de una estructura de datos a una direccion
    function assignDataStructure (uint _id, string memory _name, string memory _email) public {
        address_dataStructure[msg.sender] = Customer(_id, _name, _email);
    }

}