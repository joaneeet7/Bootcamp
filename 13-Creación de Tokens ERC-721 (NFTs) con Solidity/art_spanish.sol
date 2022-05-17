// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

import "@openzeppelin/contracts@4.5.0/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts@4.5.0/access/Ownable.sol";

contract art is ERC721, Ownable {
    
    // ============================================
    // Declaraciones iniciales
    // ============================================

    // Constructor del Smart Contract 
    constructor (string memory _name, string memory _symbol)
    ERC721(_name, _symbol){}

    // Contador de NFTs
    uint256 counter;

    // Precio de los NFTs (precio de la obra de arte)
    uint256 public fee = 5 ether;

    // Estructura de datos con las propiedades de la obra de arte
    struct Arte {
        string nombre;
        uint256 id;
        uint256 adn;
        uint8 nivel;
        uint8 rareza;
    }

    // Estructura de almacenamiento para guardar las obras de arte
    Arte [] public obras_arte;
    
    // ============================================
    // Funciones de ayuda
    // ============================================

    // Creacion de un numero aleatorio (necesario para las propiedades de los NFTs)
    function _crearRandom(uint256 _mod) internal view returns (uint256){
        // Hash aleatorio mediante el timestamp de bloque y el msg.sender
        bytes32 hash_randomNum = keccak256(abi.encodePacked(block.timestamp, msg.sender));
        // Conversion del hash uint
        uint256 randonNum = uint256(hash_randomNum);
        // Operacion modulo 
        return randonNum % _mod;
    }

    // Creacion de NFT (Obra de arte)
    function _crearArte(string memory _nombre) internal {
        // Generacion de una rareza aleatoria (modulo 1000)
        uint8 randRareza = uint8(_crearRandom(1000));
        // Generacion de un ADN aleatorio (modulo 10**16)
        uint256 randADN = _crearRandom(10**16);
        // Creacion de un objeto de tipo arte
        Arte memory arte = Arte(_nombre, counter, randADN, 1, randRareza);
        // Almacenamiento de la obra de arte
        obras_arte.push(arte);
        // Creacion del NFT de la nueva obra de arte
        _safeMint(msg.sender, counter);
        // Incremento del contador de obras de artes
        counter++;
    }

    // Actualizacion del precio del NFT 
    function actualizarFee(uint256 _fee) external onlyOwner {
        fee = _fee;
    }

    // Visualizar el saldo del Smart Contract (ethers)
    function infoSmartContract() public view returns(address, uint256){
        // Direccion del Smart Contract
        address SCaddress = address(this);
        // Balance (ethers) del Smart Contract
        uint256 SCmoney = address(this).balance / 10**18;
        // Devolucion de ambos parametros
        return (SCaddress, SCmoney);
    }

    // Obtencion de todas los NFTs (obras de arte) creados 
    function obtenerArte() public view returns (Arte [] memory){
        return obras_arte;
    }

    // Obtencion de los NFT de un usuario
    function ownerArte(address _owner) public view returns (Arte [] memory){
        // Estructura de datos para almacenar las obras de arte del usuario
        Arte [] memory resultado = new Arte[](balanceOf(_owner));
        // Contador inicializado
        uint256 counter_owner = 0;
        // Bucle para recorrer todas las obras de arte generadas 
        for (uint256 i = 0; i < obras_arte.length; i++){
            // Busqueda de obras de arte para un usuario
            if (ownerOf(i) == _owner){
                // Almacenamiento de la obra de arte del usuario
                resultado[counter_owner] = obras_arte[i];
                // Incremento del contador de obras de arte del usuario
                counter_owner++;
            }
        }
        return resultado;
    }

    // ============================================
    // Desarrollo del Token NFT
    // ============================================

    // Pago por el NFT
    function crearArte(string memory _nombre) public payable {
        require(msg.value >= fee);
        _crearArte(_nombre);
    }

    // Extraccion de ethers del Smart Contract al propietario
    function retirarDinero() external payable onlyOwner{
        // Conversion de la direccion del owner a direccion de pago
        address payable _owner = payable(owner());
        // Transferencia al owner del proyecto (en ethers)
        _owner.transfer(address(this).balance);
    }

    // Subir de nivel los NFT
    function subirNivel(uint256 _arteId) public {
        // Requerimiento de propiedad de la obra de arte
        require(ownerOf(_arteId) == msg.sender);
        // Acceso a la obra de arte identificada con su ID
        Arte storage arte = obras_arte[_arteId];
        // Incremento del nivel de la obra de arte
        arte.nivel++;
    }
}