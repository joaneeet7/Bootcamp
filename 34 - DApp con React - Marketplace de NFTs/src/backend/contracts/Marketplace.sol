// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

import "@openzeppelin/contracts/token/ERC721/IERC721.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "hardhat/console.sol";

contract Marketplace is ReentrancyGuard {

    // Variables
    address payable public immutable feeAccount; // la cuenta que recibe las tasas (fees)
    uint public immutable feePercent; // el porcentaje de la tasa (fee) sobre las ventas 
    uint public itemCount; 

    // Estructura de datos para el item publicado
    struct Item {
        uint itemId;
        IERC721 nft;
        uint tokenId;
        uint price;
        address payable seller;
        bool sold;
    }

    // Relacion entre itemId -> Item
    mapping(uint => Item) public items;

    // Evento a emitir en la publicacion de una nueva oferta
    event Offered(
        uint itemId,
        address indexed nft,
        uint tokenId,
        uint price,
        address indexed seller
    );

    // Evento a emitir en la compra de un item
    event Bought(
        uint itemId,
        address indexed nft,
        uint tokenId,
        uint price,
        address indexed seller,
        address indexed buyer
    );

    // Constructor
    constructor(uint _feePercent) {
        feeAccount = payable(msg.sender);
        feePercent = _feePercent;
    }

    // Crear un item para ofrecer en el mercado
    function makeItem(IERC721 _nft, uint _tokenId, uint _price) external nonReentrant {
        // Requisito del precio del item
        require(_price > 0, "El precio debe ser superior a cero");
        // Incremento del itemCount
        itemCount ++;
        // Transferencia del nft
        _nft.transferFrom(msg.sender, address(this), _tokenId);
        // Añadir un nuevo item a la estructura de datos de items
        items[itemCount] = Item (
            itemCount,
            _nft,
            _tokenId,
            _price,
            payable(msg.sender),
            false
        );
        // Emision del evento (nuevo item ofrecido al mercado)
        emit Offered(
            itemCount,
            address(_nft),
            _tokenId,
            _price,
            msg.sender
        );
    }

    // Comprar un item en el Marketplace de NFTs
    function purchaseItem(uint _itemId) external payable nonReentrant {
        uint _totalPrice = getTotalPrice(_itemId);
        Item storage item = items[_itemId];
        require(_itemId > 0 && _itemId <= itemCount, "El articulo no existe.");
        require(msg.value >= _totalPrice, "No tienes suficiente ether para cubrir el precio del articulo y la tasa de mercado.");
        require(!item.sold, "Item ya vendido.");
        // Pagar al vendedor y a las tasas
        item.seller.transfer(item.price);
        feeAccount.transfer(_totalPrice - item.price);
        // Actualizar el item a vendido
        item.sold = true;
        // Transferencia del NFT al comprador
        item.nft.transferFrom(address(this), msg.sender, item.tokenId);
        // Emision del evento (item comprado)
        emit Bought(
            _itemId,
            address(item.nft),
            item.tokenId,
            item.price,
            item.seller,
            msg.sender
        );
    }

    // Obtencion del precio tota
    function getTotalPrice(uint _itemId) view public returns(uint){
        return((items[_itemId].price*(100 + feePercent))/100);
    }
}
