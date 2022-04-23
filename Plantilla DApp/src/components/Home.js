import React, { Component } from 'react';
import smart_contract from '../abis/Migrations.json';
import Web3 from 'web3';
import logo from '../logo.png';

import Navigation from './Navbar';
import MyCarousel from './Carousel';

class App extends Component {

  async componentDidMount() {
    // 1. Carga de Web3
    await this.loadWeb3()
    // 2. Carga de datos de la Blockchain
    await this.loadBlockchainData()
  }

  // 1. Carga de Web3
  async loadWeb3() {
    if (window.ethereum) {
      window.web3 = new Web3(window.ethereum)
      const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
      console.log('Accounts: ', accounts)
    }
    else if (window.web3) {
      window.web3 = new Web3(window.web3.currentProvider)
    }
    else {
      window.alert('¡Deberías considerar usar Metamask!')
    }
  }

  // 2. Carga de datos de la Blockchain
  async loadBlockchainData() {
    const web3 = window.web3
    const accounts = await web3.eth.getAccounts()
    this.setState({ account: accounts[0] })
    // Ganache -> 5777, Rinkeby -> 4, BSC -> 97
    const networkId = await web3.eth.net.getId() 
    console.log('networkid:', networkId)
    const networkData = smart_contract.networks[networkId]
    console.log('NetworkData:', networkData)

    if (networkData) {
      const abi = smart_contract.abi
      console.log('abi', abi)
      const address = networkData.address
      console.log('address:', address)
      const contract = new web3.eth.Contract(abi, address)
      this.setState({ contract })
    } else {
      window.alert('¡El Smart Contract no se ha desplegado en la red!')
    }
  }

  constructor(props) {
    super(props)
    this.state = {
      account: '0x0',
      loading: true
    }
  }

  render() {
    return (
      <div>
        <Navigation account={this.state.account} />
        <MyCarousel />
        <div className="container-fluid mt-5">
          <div className="row">
            <main role="main" className="col-lg-12 d-flex text-center">
              <div className="content mr-auto ml-auto">
                <a
                  href="https://blockstellart.com/rutas-de-aprendizaje/blockchain/"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <img src={logo} className="App-logo" alt="" width="100%" height="80%" />
                </a>
                <h1>DApp (Autor: <a href="https://www.linkedin.com/in/joanamengual7/">Joan Amengual</a>)</h1>
                <p>
                  Edita <code>src/components/App.js</code> y guarda para recargar.
                </p>
                <a
                  className="App-link"
                  href="https://blockstellart.com/rutas-de-aprendizaje/blockchain/"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  ¡APRENDE BLOCKCHAIN <u><b>AHORA! </b></u>
                </a>
              </div>
            </main>
          </div>
        </div>
      </div>
    );
  }
}

export default App;
