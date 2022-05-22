// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

// ERC-20: https://github.com/OpenZeppelin/openzeppelin-contracts/tree/master/contracts/token/ERC20
// Interfaz del estandard definido por la EIP (https://eips.ethereum.org/EIPS/eip-20)

interface IERC20 {

    //Devuelve la cantidad de tokens existentes.
    function totalSupply() external view returns (uint256);

    //Devuelve la cantidad de tokens que posee una `account`.
    function balanceOf(address account) external view returns (uint256);

    /* Realiza una transferencia de tokens a un destinatario.
    Devuelve un valor booleano que indica si la operacion tuvo exito. 
    Emite un evento {Transfer}. */
    function transfer(address to, uint256 amount) external returns (bool);

    /* Devuelve el numero restante de tokens que se le permitira al `spender`
    gastar en nombre del `owner` a traves de {transferFrom}. Este valor es
    cero por defecto. Este valor cambia cuando {approve} o {transferFrom} son llamados. */
    function allowance(address owner, address spender) external view returns (uint256);

    /* Establece una `amount` como la asignacion de `spender` sobre los tokens 
    de la persona que llama. Devuelve un valor booleano que indica si la operacion tuvo exito.
    Emite un evento {Approval}. */
    function approve(address spender, uint256 amount) external returns (bool);

    /* Mueve los tokens de una direccion a otra utilizando el mecanismo de asignacion. 
    Devuelve un valor booleano que indica si la operacion tuvo exito.
    Emite un evento {Transfer}. */
    function transferFrom(
        address from,
        address to,
        uint256 amount
    ) external returns (bool);

    /* Se emite cuando se realiza una transferencia de tokens. 
    Ten en cuenta que `value` puede ser cero. */
    event Transfer(address indexed from, address indexed to, uint256 value);

    /* Se emite cuando la asignacion de un `spender` para un `owner` se establece mediante
    una llamada a {approve}. El `value` es la nueva asignacion. */
    event Approval(address indexed owner, address indexed spender, uint256 value);
}

// Smart Contract de los tokens ERC20
contract ERC20 is IERC20 {

    // Estructuras de datos
    mapping(address => uint256) private _balances;
    mapping(address => mapping(address => uint256)) private _allowances;
    
    // Variables
    uint256 private _totalSupply;
    string private _name;
    string private _symbol;

    /* Establece el valor del nombre y el simbolo del token. 
    El valor por defecto de {decimaes} es 18. Para seleccionar un valor diferente para
    {decimals} debemos remplazarlo. */
    constructor(string memory name_, string memory symbol_) {
        _name = name_;
        _symbol = symbol_;
    }

    // Devuelve el nombre del token.
    function name() public view virtual returns (string memory) {
        return _name;
    }

    // Devuelve el simbolo del token, normalmente una version mas corta del nombre.
    function symbol() public view virtual returns (string memory) {
        return _symbol;
    }

    /* Devuelve el numero de decimales utilizados para obtener su representacion de usuario.
    Por ejemplo, si `decimals` es igual a `2`, un saldo de `505` tokens deberia
    mostrarse al usuario como `5.05` (`505 / 10 ** 2`).
    Los tokens suelen optar por un valor de 18, imitando la relacion entre
    Ether y Wei. Este es el valor que utiliza {ERC20}, a menos que esta funcion sea
    sea anulada. */
    function decimals() public view virtual returns (uint8) {
        return 18;
    }

    // Ver: {IERC20-totalSupply}.
    function totalSupply() public view virtual override returns (uint256) {
        return _totalSupply;
    }

    // Ver: {IERC20-balanceOf}.
    function balanceOf(address account) public view virtual override returns (uint256) {
        return _balances[account];
    }

    /* Ver: {IERC20-transfer}.
    Requisitos:
    - `to` no puede ser la direccion cero.
    - la persona que ejecuta debe tener un saldo de al menos `amount`. */
    function transfer(address to, uint256 amount) public virtual override returns (bool) {
        address owner = msg.sender;
        _transfer(owner, to, amount);
        return true;
    }

    // Ver: {IERC20-allowance}.
    function allowance(address owner, address spender) public view virtual override returns (uint256) {
        return _allowances[owner][spender];
    }

    /* Ver: {IERC20-approve}.
    Requisitos:
    - `spender` no puede ser una direccion cero. */
    function approve(address spender, uint256 amount) public virtual override returns (bool) {
        address owner = msg.sender;
        _approve(owner, spender, amount);
        return true;
    }

    /* Ver: {IERC20-transferFrom}.
    Emite un evento de {Approval} indicando el permiso actualizado. Esto no es
    requerido por la EIP. 
    Requisitos:
    - `from` y `to` no pueden ser direcciones cero.
    - `from` debe tener un saldo de al menos `amount`.
    - la persona que ejecuta debe tener una asignacion para los tokens de `from` de al menos `amount`. */
    function transferFrom(
        address from,
        address to,
        uint256 amount
    ) public virtual override returns (bool) {
        address spender = msg.sender;
        _spendAllowance(from, spender, amount);
        _transfer(from, to, amount);
        return true;
    }

    /* Aumenta atomicamente la asignacion concedida al `spender` por el usuario que ejecuta.
    Emite un evento de {Approval} indicando el permiso actualizado.
    Requisitos:
    - `spender` no puede ser una direccion cero. */
    function increaseAllowance(address spender, uint256 addedValue) public virtual returns (bool) {
        address owner = msg.sender;
        _approve(owner, spender, _allowances[owner][spender] + addedValue);
        return true;
    }

    /* Disminuye atomicamente la asignacion concedida al `spender` por el usuario que ejecuta.
    Emite un evento de {Approval} indicando el permiso actualizado.
    Requisitos:
    - `spender` no puede ser la direccion cero.
    - `spender` debe tener una asignacion para el usuario que ejecuta de al menos `subtractedValue`. */
    function decreaseAllowance(address spender, uint256 subtractedValue) public virtual returns (bool) {
        address owner = msg.sender;
        uint256 currentAllowance = _allowances[owner][spender];
        require(currentAllowance >= subtractedValue, "ERC20: decreased allowance below zero");
        unchecked {
            _approve(owner, spender, currentAllowance - subtractedValue);
        }
        return true;
    }

    /* Mueve `amount` de tokens del `sender` al `recipient`.
    Esta funcion interna es equivalente a {transfer}, y puede utilizarse para
    por ejemplo, implementar fees (tarifas) automaticas de tokens, etc.
    Emite un evento {Transfer}.
    Requisitos:
    - `from` y `to` no pueden ser direcciones cero.
    - `from` debe tener un saldo de al menos `amount`. */
    function _transfer(
        address from,
        address to,
        uint256 amount
    ) internal virtual {
        require(from != address(0), "ERC20: transfer from the zero address");
        require(to != address(0), "ERC20: transfer to the zero address");
        _beforeTokenTransfer(from, to, amount);
        uint256 fromBalance = _balances[from];
        require(fromBalance >= amount, "ERC20: transfer amount exceeds balance");
        unchecked {
            _balances[from] = fromBalance - amount;
        }
        _balances[to] += amount;
        emit Transfer(from, to, amount);
        _afterTokenTransfer(from, to, amount);
    }

    /* Crea tokens de `amount` y las asigna a `account`, aumentando
    el suministro total.
    Emite un evento {Transfer} con "from" como direccion cero.
    Requisitos:
    - `account` no puede ser la direccion cero. */
    function _mint(address account, uint256 amount) internal virtual {
        require(account != address(0), "ERC20: mint to the zero address");
        _beforeTokenTransfer(address(0), account, amount);
        _totalSupply += amount;
        _balances[account] += amount;
        emit Transfer(address(0), account, amount);
        _afterTokenTransfer(address(0), account, amount);
    }

    /* Destruye la `amount` de tokens de `account`, reduciendo el
    suministro total.
    Emite un evento {Transfer} con "to" como direccion cero.
    Requisitos:
    - `account` no puede ser la direccion cero.
    - `account` debe tener al menos tokens de `amount`. */
    function _burn(address account, uint256 amount) internal virtual {
        require(account != address(0), "ERC20: burn from the zero address");
        _beforeTokenTransfer(account, address(0), amount);
        uint256 accountBalance = _balances[account];
        require(accountBalance >= amount, "ERC20: burn amount exceeds balance");
        unchecked {
            _balances[account] = accountBalance - amount;
        }
        _totalSupply -= amount;
        emit Transfer(account, address(0), amount);
        _afterTokenTransfer(account, address(0), amount);
    }

    /* Establece la `amount` como la asignacion de `spender` sobre los tokens del `owner`.
    Emite un evento de {Approval}.
    Requisitos:
    - `owner` no puede ser la direccion cero.
    - `spender` no puede ser la direccion cero. */
    function _approve(
        address owner,
        address spender,
        uint256 amount
    ) internal virtual {
        require(owner != address(0), "ERC20: approve from the zero address");
        require(spender != address(0), "ERC20: approve to the zero address");
        _allowances[owner][spender] = amount;
        emit Approval(owner, spender, amount);
    }

    /* Gasta `amount` de la asignacion del `owner` hacia el `spender`.
    - No actualiza el importe de la asignacion en caso de asignacion infinita.
    - Revertir si no hay suficiente asignacion disponible.
    Puede emitir un evento de {Approval}. */
    function _spendAllowance(
        address owner,
        address spender,
        uint256 amount
    ) internal virtual {
        uint256 currentAllowance = allowance(owner, spender);
        if (currentAllowance != type(uint256).max) {
            require(currentAllowance >= amount, "ERC20: insufficient allowance");
            unchecked {
                _approve(owner, spender, currentAllowance - amount);
            }
        }
    }

    /* Hook que se llama antes de cualquier transferencia de tokens. Esto incluye
    "minting" y "burning".
    Condiciones de llamada:
    - cuando `from` y `to` son ambos distintos de cero, `amount` de los tokens de `from` 
    se transferira a `to` .
    - cuando `from` es cero, se acuñaran tokens `amount` para `to` .
    - cuando `to` sea cero, se quemara la `amount` de tokens de `from`.
    - `from` y `to` nunca son ambos cero. */
    function _beforeTokenTransfer(
        address from,
        address to,
        uint256 amount
    ) internal virtual {}

    /* Hook que se llama despues de cualquier transferencia de tokens. Esto incluye
    "minting" y "burning".
    Condiciones de llamada:
    - cuando `from` y `to` son ambos distintos de cero, `amount` de los tokens de 
    `from` ha sido transferido a `to` .
    - cuando `from` es cero, se han minteado tokens `amount` para `to`.
    - cuando `to` es cero, se han quemado la `amount` de tokens de `from`.
    - `from` y `to` nunca son ambos cero. */
    function _afterTokenTransfer(
        address from,
        address to,
        uint256 amount
    ) internal virtual {}
}