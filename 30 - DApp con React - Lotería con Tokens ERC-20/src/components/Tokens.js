import React, { Component } from 'react';
import smart_contract from '../abis/loteria.json';
import Web3 from 'web3';
import Swal from 'sweetalert2';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';

import Navigation from './Navbar';
import MyCarousel from './Carousel';

class Tokens extends Component {

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

  // Balance de tokens de un usuario
  _balanceTokens = async () => {
    try {
      console.log("Balance de tokens en ejecución...")
      const web3 = window.web3
      const accounts = await web3.eth.getAccounts()
      const _balance = await this.state.contract.methods.balanceTokens(accounts[0]).call()

      // Balance de tokens
      Swal.fire({
        title: `Balance de tokens del usuario:`,
        text: `${_balance} tokens`,
        width: 800,
        icon: 'info',
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

  // Balance de tokens del Smart Contract
  _balanceTokensSC = async () => {
    try {
      console.log("Balance de tokens del Smart Contract en ejecución...")
      const _balanceTokensSC = await this.state.contract.methods.balanceTokensSC().call()

      // Balance de tokens
      Swal.fire({
        title: 'Balance de tokens del Smart Contract:',
        text: `${_balanceTokensSC} tokens`,
        width: 800,
        icon: 'info',
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

  // Balance de ethers del Smart Contract
  _balanceEthersSC = async () => {
    try {
      console.log("Balance de ethers del Smart Contract en ejecución...")
      const _balanceEthersSC = await this.state.contract.methods.balanceEthersSC().call()

      // Balance de ethers
      Swal.fire({
        title: 'Balance de ethers del Smart Contract:',
        text: `${_balanceEthersSC} ethers`,
        width: 800,
        icon: 'info',
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

  // Devolucion de tokens ERC-20
  _devolverTokens = async (_numTokens) => {
    try {
      console.log("Devolucion de tokens en ejecución...")
      const web3 = window.web3
      const accounts = await web3.eth.getAccounts()
      await this.state.contract.methods.devolverTokens(_numTokens).send({ from: accounts[0] })

      // Notificacion de devolucion
      Swal.fire({
        title: '¡Devolución de tokens realizada!',
        text: `Has devuelto ${_numTokens} token/s`,
        width: 800,
        icon: 'warning',
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

  // Precio del boleto de loteria
  _precioBoleto = async () => {
    try {
      console.log("Precio del boleto de loteria en ejecución...")
      const _precio = await this.state.contract.methods.precioBoleto().call()

      // Precio del boleto
      Swal.fire({
        title: `El precio del boleto de lotería es de ${_precio} ethers`,
        width: 800,
        icon: 'info',
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

  // Compra de boletos de loteria
  _compraBoleltos = async (_numBoletos) => {
    try {
      console.log("Compra de boletos de loteria en ejecución...")
      const web3 = window.web3
      const accounts = await web3.eth.getAccounts()
      await this.state.contract.methods.compraBoleto(_numBoletos).send({ from: accounts[0] })

      // Notificacion de compra
      Swal.fire({
        title: 'Compra de boletos realizada, ¡¡mucha suerte!!',
        text: `Has comprado ${_numBoletos} boletos`,
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

  // Visualizacion de los numeros de loteria
  _tusBoletos = async () => {
    try {
      console.log("Visualizacion de tus boletos de loteria en ejecución...")
      const _boletos = await this.state.contract.methods.tusBoletos().call()

      // Balance de tokens
      Swal.fire({
        title: `Tus boletos son:`,
        text: `${_boletos}`,
        width: 800,
        icon: 'info',
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

  // Generacion del ganador de la loteria
  _generarGanador = async () => {
    try {
      console.log("Generacion del ganador de la loteria en ejecución...")
      const web3 = window.web3
      const accounts = await web3.eth.getAccounts()
      await this.state.contract.methods.generarGanador().send({ from: accounts[0] })

    } catch (err) {
      this.setState({ errorMessage: err.message })
    } finally {
      this.setState({ loading: false })
    }
  }

  // Visualizacion del ganador de la loteria
  _ganador = async () => {
    try {
      console.log("Visualización del ganador de la loteria en ejecución...")
      const winner = await this.state.contract.methods.ganador().call()

      // Direccion del ganador de la loteria
      Swal.fire({
        title: 'El ganador de la lotería es:',
        text: `${winner}`,
        width: 800,
        icon: 'info',
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
        <Navigation account={this.state.account} /> 
        <MyCarousel />
        <div className="container-fluid mt-5">
          <div className="row">
            <main role="main" className="col-lg-12 d-flex text-center">
              <div className="content mr-auto ml-auto">

                <h1>Gestión de los Tokens ERC-20</h1>
                &nbsp;
                <Container>
                  <Row>
                    <Col>
                      <h3>Tokens usuario</h3>
                      <form onSubmit={(event) => {
                        event.preventDefault()
                        this._balanceTokens()
                      }
                      }>

                        <input type="submit"
                          className='bbtn btn-block btn-success btn-sm'
                          value='BALANCE DE TOKENS' />
                      </form>
                    </Col>

                    <Col>
                      <h3>Tokens SC </h3>
                      <form onSubmit={(event) => {
                        event.preventDefault()
                        this._balanceTokensSC()
                      }
                      }>

                        <input type="submit"
                          className='bbtn btn-block btn-info btn-sm'
                          value='BALANCE DE TOKENS (SC)' />
                      </form>
                    </Col>

                    <Col>
                      <h3>Ethers SC </h3>
                      <form onSubmit={(event) => {
                        event.preventDefault()
                        this._balanceEthersSC()
                      }
                      }>

                        <input type="submit"
                          className='bbtn btn-block btn-danger btn-sm'
                          value='BALANCE DE ETHERS (SC)' />
                      </form>
                    </Col>
                  </Row>
                </Container>

                &nbsp;

                <h3>Compra de tokens ERC-20</h3>
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

                &nbsp;

                <h3>Devolución de tokens ERC-20</h3>
                <form onSubmit={(event) => {
                  event.preventDefault()
                  const cantidad = this._numTokensDevolver.value
                  this._devolverTokens(cantidad)
                }
                }>
                  <input type="number"
                    className="form-control mb-1"
                    placeholder="Cantidad de tokens a devolver"
                    ref={(input) => this._numTokensDevolver = input} />

                  <input type="submit"
                    className='bbtn btn-block btn-warning btn-sm'
                    value='DEVOLVER TOKENS' />
                </form>
              </div>
            </main>
          </div>
        </div>
      </div>
    );
  }
}

export default Tokens;
