import React, { Component } from 'react';
import smart_contract from '../abis/loteria.json';
import Web3 from 'web3';
import Swal from 'sweetalert2';

import Navigation from './Navbar';
import MyCarousel from './Carousel';

class Ganador extends Component {

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
      loading: true,
      contract: null,
      errorMessage: ""
    }
  }

  _generarGanador = async () => {
    try {
      console.log("Generacion del ganador en ejecucion...")
      await this.state.contract.methods.generarGanador().send({
        from: this.state.account
      })
      Swal.fire({
        icon: 'success',
        title: '¡Ganador generado correctamente!',
        width: 800,
        padding: '3em',
        backdrop: `
          rgba(15, 238, 168, 0.2)
          left top
          no-repeat
        `
      })
    } catch (err) {
      this.setState({ errorMessage: err })
    } finally {
      this.setState({ loading: false })
    }
  }

  _ganador = async () => {
    try {
      console.log("Visualizacion del ganador en ejecucion...")
      const winner = await this.state.contract.methods.ganador().call()
      Swal.fire({
        icon: 'info',
        title: 'El ganador de la Lotería es:',
        text: `${winner}`,
        width: 800,
        padding: '3em',
        backdrop: `
          rgba(15, 238, 168, 0.2)
          left top
          no-repeat
        `
      })
    } catch (err) {
      this.setState({ errorMessage: err })
    } finally {
      this.setState({ loading: false })
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
                <h1> Generación de un ganador en la Lotería</h1>
                <form onSubmit={(event) => {
                  event.preventDefault()
                  this._generarGanador()
                }}>
                  <input type="submit"
                    className="bbtn btn-block btn-info btn-sm"
                    value="GENERAR GANADOR" />
                </form>
                &nbsp;
                <form onSubmit={(event) => {
                  event.preventDefault()
                  this._ganador()
                }}>
                  <input type="submit"
                    className="bbtn btn-block btn-success btn-sm"
                    value="VISUALIZAR GANADOR" />
                </form>
              </div>
            </main>
          </div>
        </div>
      </div>
    );
  }
}

export default Ganador;
