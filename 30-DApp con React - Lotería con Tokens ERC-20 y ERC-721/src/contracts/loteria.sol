// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;
import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC721/ERC721.sol";

contract loteria is ERC20, Ownable {
    
    // ============================================
    // Gestion de los tokens
    // ============================================  
    
    // Direccion del contrato NFT del proyecto
    address public nft;

    // Constructor 
    constructor () ERC20("Loteria", "JA") {
        _mint(address(this), 1000);
        nft = address(new mainERC721());
    }

    // Ganador del premio de la loteria
    address public ganador;

   // Precio de los tokens del proyecto
    function precioTokens(uint256 _numTokens) internal pure returns (uint256){
        return _numTokens * (1 ether);
    }

    // Visualizacion del balance de tokens de una persona
    function balanceTokens(address _account) public view returns (uint256){ 
        return balanceOf(_account);
    }

    // Visualizacion del balance de tokens del Smart Contract
    function balanceTokensSC() public view returns (uint256){ 
        return balanceOf(address(this));
    }

    // Visualizacion del balance de ethers del Smart Contract
    function balanceEthersSC() public view returns (uint256){
        return address(this).balance / 10**18;
    }    

    // Nuevos tokens erc-20
    function mint(uint256 _cantidad) public onlyOwner {
        _mint(address(this), _cantidad);
    }    

    // Registro del usuario 
    mapping (address => address) public usuario_contract;
    function registrar() internal {
        address addr_personal_contract = address(new boletosNFTs(msg.sender, address(this), nft)); 
        usuario_contract[msg.sender] = addr_personal_contract;
    } 

    // Compra de tokens 
    function compraTokens(uint256 _numTokens) public payable {
        if(usuario_contract[msg.sender] == address(0)){
            registrar();
        }
        // Establecimiento del coste de los tokens a comprar
        uint256 coste = precioTokens(_numTokens);
        // Evaluacion del dinero que el cliente paga por los tokens
        require(msg.value >= coste, "Compra menos tokens o paga con mas ethers");
        // Obtencion del numero de tokens disponibles en el Smart Contract
        uint256 balance = balanceTokens(address(this));
        require(_numTokens <= balance, "Compra un numero menor de tokens.");
        //  El returnValue se define como lo que paga el cliente menos lo que vale el producto
        uint256 returnValue = msg.value - coste;
        // El Smart Contract devuelve la cantidad restante al cliente
        payable(msg.sender).transfer(returnValue);
        // El numero de tokens comprados se transfiere al cliente 
        _transfer(address(this), msg.sender, _numTokens);
    }

    // Devolucion de los tokens al Smart Contract 
    function devolverTokens(uint _numTokens) public payable {
        // El numero de tokens a devolver debe ser mayor a 0 
        require(_numTokens > 0 , "Necesitas devolver un numero positivo de tokens.");
        // El usuario debe tener los tokens que desea devolver 
        require (_numTokens <= balanceTokens(msg.sender), "No tienes los tokens que deseas devolver.");
        // El usuario transfiere los tokens al Smart Contract
        _transfer(msg.sender, address(this), _numTokens);
        // El Smart Contract envia los ethers al usuario
        payable(msg.sender).transfer(precioTokens(_numTokens));
    }

    // ============================================
    // Gestion de la loteria
    // ============================================
    
    // Precio del boleto de loteria (en tokens) 
    uint public precioBoleto = 5;
    // Relacion: persona que compra los boletos -> el numero de los boletos
    mapping (address => uint []) idPersona_boletos;
    // Relacion: boleto -> ganador
    mapping (uint => address) ADNBoleto;
    // Numero aleatorio
    uint randNonce = 0;
    // Boletos de la loteria generados 
    uint [] boletosComprados;    
    
    // Compra de boletos de loteria
    function compraBoleto(uint _numBoletos) public {
        // Precio total de los boletos a comprar
        uint precioTotal = _numBoletos*precioBoleto;
        // Verificacion de los tokens del usuario
        require (precioTotal <= balanceTokens(msg.sender), "Necesitas comprar mas tokens.");
        // Transferencia de tokens del usuario al Smart Contract
        _transfer(msg.sender, address(this), precioTotal);
        /* Recoge la marca de tiempo (block.timestamp), msg.sender y un Nonce
        (un numero que solo se utiliza una vez, para que no ejecutemos dos veces la misma 
        funcion de hash con los mismos parametros de entrada) en incremento.
        Se utiliza 'keccak256 'para convertir estas entradas a un hash aleatorio, 
        convertir ese hash a un uint y luego utilizamos % 10000 para tomar los ultimos 4 digitos,
        dando un valor aleatorio entre 0 - 9999. */
        for (uint i = 0; i < _numBoletos; i++) {
            uint random = uint(keccak256(abi.encodePacked(block.timestamp, msg.sender, randNonce))) % 10000;
            randNonce++;
            // Almacenamiento de los datos de los boletos de loteria
            idPersona_boletos[msg.sender].push(random);
            // Numero del boleto comprado
            boletosComprados.push(random);
            // Asignacion del ADN del boleto para la generacion de un ganador 
            ADNBoleto[random] = msg.sender;
            // Creacion de un nuevo NFT para el numero de boleto
            boletosNFTs(usuario_contract[msg.sender]).mintBoleto(msg.sender, random);
        }
        
    }
    
    // Visualizacion de los boletos del usuario
    function tusBoletos(address _propietario) public view returns (uint [] memory){
        return idPersona_boletos[_propietario];
    }

    // Generacion del ganador de la loteria
    function generarGanador() public onlyOwner {
        // Verificacion de la compra de mas 1 boleto o mas
        require(boletosComprados.length > 0, "No hay boletos comprados");
        // Declaracion de la longitud del array 
        uint longitud = boletosComprados.length;
        // Eleccion aleatoria de un numero entre: [0 - Longitud]
        uint random = uint(uint(keccak256(abi.encodePacked(block.timestamp))) % longitud);
        // Seleccion del numero aleatorio mediante la posicion del array aleatoria
        uint eleccion = boletosComprados[random];
        // Direccion del ganador de la loteria
        ganador = ADNBoleto[eleccion];
        // Envio del 95% del premio de loteria al ganador 
        payable(ganador).transfer(address(this).balance * 95 / 100);
        // Envio del 5% del premio de loteria al owner 
        payable(owner()).transfer(address(this).balance * 5 / 100);
    }

}

// Smart Contract de NFTs del proyecto
contract mainERC721 is ERC721 {
    constructor() ERC721("Loteria", "STE"){}

    function safeMint(address _propietario, uint _boleto) public {
        _safeMint(_propietario, _boleto);
    }
}

// Smart Contract para la generacion de NFTs para cada boleto generado
contract boletosNFTs {

    // Constructor del Smart Contract (hijo)
    constructor (address _propietario, address _contratoPadre, address _contratoNFT) {
        propietario.direccionPropietario = _propietario;
        propietario.contratoPadre = _contratoPadre;
        propietario.contratoNFT = _contratoNFT;
        propietario.contratoUsuario = address(this);
    }

    // Datos relevantes del propietario del Smart Contract (hijo)
    Owner public propietario;
    struct Owner {
        address direccionPropietario;
        address contratoPadre;
        address contratoNFT;
        address contratoUsuario;
    }

    // Conversion de los numeros de los boletos de loteria a NFTs
    function mintBoleto(address _propietario, uint _boleto) public {
        mainERC721(propietario.contratoNFT).safeMint(_propietario, _boleto);
    }   
}