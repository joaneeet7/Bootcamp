### 1. Instalación de dependencias
```
$ npm install
```

## Ethers.js scripts

### 1_accounts.js - Lee el balance de ether de una dirección de la wallet
- Input: ID Infura 
```
$ node code/1_accounts.js
```

### 2_read_smart_contract.js - Lee el balance de una dirección de la wallet DAI desde un DAI Smart Contract
- Input: ID Infura 
```
$ node code/2_read_smart_contract.js
```
### 3_send_signed_transaction.js - Transfiere 0.025 ether de account1 a account2
- Input: ID Infura 
- Input: Clave pública account1 
- Input: Clave pública account2 
- Input: Clave privada account1 
```
$ node code/3_send_signed_transaction.js
```

### 4_deploy_contract.js - Despliega un Smart Contract en Testnet usando un Factory 
- Input: ID Infura 
- Input: Clave privada de la account 
```
$ node code/4_deploy_contract.js
```

### 5_write_contract.js - Transfiere todo el balance de tokens elegido de account1 a account2 (en Kovan testnet)
- Input: ID Infura 
- Input: Clave pública account1 
- Input: Clave pública account2 
- Input: Clave privada account1 
- Input: Dirección del Smart Contract de token que quieres transferir
```
$ node code/5_write_contract.js
```

### 6_contract_event_stream.js - Pregunta a un bloqye por los eventos emitidos 
- Input: ID Infura 
```
$ node code/6_contract_event_stream.js
```

### 7_inspecting_blocks.js - Obtiene las transacciones de un bloque
- Input: ID Infura 
```
$ node code/7_inspecting_blocks.js
```