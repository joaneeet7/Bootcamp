### 1. Install Dependencies:
`$ npm install`
### 2. Arranque de la Blockchain de desarrollo local
`$ npx hardhat node`

### 3. Conectar las cuentas del blockchain de desarrollo a Metamask
- Copiar la clave privada de las direcciones e importarla a Metamask
- Conecta tu metamask al hardhat blockchain, 127.0.0.1:8545.

### 4. Migrar los Smart Contracts
`npx hardhat run src/backend/scripts/deploy.js --network ganache`

### 5. Ejecutar los Tests
`$ npx hardhat test`

### 6. Lanzar el Frontend
`$ npm run start`