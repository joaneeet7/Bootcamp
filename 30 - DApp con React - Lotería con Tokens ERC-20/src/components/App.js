import React, { Component } from 'react';
import './App.css';
import Web3 from 'web3'
import Navbar from './Navbar';
import MyCarousel from './Carousel';
import MyFooter from './Footer';
import smart_contract from '../abis/loteria.json'
import { Icon } from 'semantic-ui-react'
import Swal from 'sweetalert2'

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

  // Constructor
  constructor(props) {
    super(props)
    this.state = {
      account: '0x0',
      loading: true,
      contract: null,
      errorMessage: ""
    }
  }

  // Compra de tokens ERC-20
  _compraTokens = async (_numTokens) => {
    try {
      console.log("Compra de tokens en ejecución...")
      const web3 = window.web3
      const accounts = await web3.eth.getAccounts()
      const ethers = web3.utils.toWei(this._numTokens.value, 'ether')
      await this.state.contract.methods.compraTokens(_numTokens).send({ from: accounts[0], value: ethers })

      // Notificacion de compra
      Swal.fire({
        title: '¡Compra de tokens realizada!',
        text: `Has comprado ${_numTokens} token/s por un valor de ${ethers / 10 ** 18} ether/s`,
        width: 800,
        icon: 'success',
        padding: '3em',
        backdrop: `
            rgba(15, 238, 168,0.2)
            left top
            no-repeat
          `
      })
    } catch (err) {
      this.setState({ errorMessage: err.message })
    } finally {
      this.setState({ loading: false })
    }
  }

  render() {
    return (
      <div>
        <Navbar account={this.state.account} />
        <MyCarousel />
        <div className="container-fluid mt-5">
          <div className="row">
            <main role="main" className="col-lg-12 d-flex text-center">
              <div className="content mr-auto ml-auto">
                <h3> <Icon circular inverted color='red' name='dollar' /> Compra de tokens ERC-20</h3>
                <form onSubmit={(event) => {
                  event.preventDefault()
                  const cantidad = this._numTokens.value
                  this._compraTokens(cantidad)
                }
                }>
                  <input type="number"
                    className="form-control mb-1"
                    placeholder="Cantidad de tokens a comprar"
                    ref={(input) => this._numTokens = input} />

                  <input type="submit"
                    className='bbtn btn-block btn-primary btn-sm'
                    value='COMPRAR TOKENS' />
                </form>
              </div>
            </main>
          </div>
        </div>
        <MyFooter />
      </div>
    );
  }
}

export default App;
