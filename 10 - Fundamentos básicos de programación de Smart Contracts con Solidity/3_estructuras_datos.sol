// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract data_structures {
    // Estructura de datos de un cliente
    struct Customer {
        uint256 id;
        string name;
        string email;
    }

    // Variable de tipo de cliente
    Customer customer_1 = Customer(1, "Joan", "joan@gmail.com");

    // Array de uints de longitud fija 5
    uint256[5] public fixed_list_uints = [1,2,3,4,5];

    // Array dinámico de uints
    uint256 [] dynamic_list_uints;

    // Array dinámico de tipo de cliente
    Customer [] public dynamic_list_customer;

    // Nuevos datos en un array 
    function array_modification(uint256 _id, string memory _name, string memory _email) public {
        dynamic_list_customer.push(Customer(_id, _name, _email));
    }

    // Mappings
    mapping (address => uint256) public address_uint;
    mapping (string => uint256 []) public string_listUnits;
    mapping (address => Customer) public address_dataStructure;

    // Asignar un número a una dirección
    function assignNumber(uint256 _number) public {
        address_uint[msg.sender] = _number;
    }

    // Asignar un número a una dirección
    function assignList(string memory _name, uint256 _number) public {
        string_listUnits[_name].push(_number);
    }

    // Asignación de una estructura de datos a una dirección
    function assignDataStructure (uint _id, string memory _name, string memory _email) public {
        address_dataStructure[msg.sender] = Customer(_id, _name, _email);
    }
}