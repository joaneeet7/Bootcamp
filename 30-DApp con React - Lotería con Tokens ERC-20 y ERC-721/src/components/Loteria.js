import React, { Component } from 'react';
import smart_contract from '../abis/loteria.json';
import Web3 from 'web3';
import Swal from 'sweetalert2';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';

import Navigation from './Navbar';
import MyCarousel from './Carousel';
import { Container } from 'react-bootstrap';

class Loteria extends Component {

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

    _compraBoletos = async (_numBoletos) => {
        try {
            console.log("Compra de boletos de loteria en ejecucion...")
            await this.state.contract.methods.compraBoleto(_numBoletos).send({
                from: this.state.account
            })
            Swal.fire({
                icon: 'success',
                title: 'Compra de boletos completada, ¡mucha suerte!',
                width: 800,
                padding: '3em',
                text: `Has comprado ${_numBoletos} boletos`,
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

    _precioBoleto = async () => {
        try {
            console.log("Precio del boleto en ejecucion...")
            const _precio = await this.state.contract.methods.precioBoleto().call()
            Swal.fire({
                icon: 'info',
                title: `El precio del boleto es de ${_precio} tokens (ERC-20)`,
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

    _tusBoletos = async () => {
        try {
            console.log("Visualizacion de tus boletos en ejecucion...")
            const _boletos = await this.state.contract.methods.tusBoletos(
                this.state.account
            ).call()
            Swal.fire({
                icon: 'info',
                title: `Tus boletos son:`,
                width: 800,
                text: `${_boletos}`,
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
                                <h1> Gestión de la Lotería con ERC-20 y ERC-721 </h1>
                                <h3> Compra de boletos </h3>
                                <form onSubmit={(event) => {
                                    event.preventDefault()
                                    const cantidad = this._numBoletos.value
                                    this._compraBoletos(cantidad)
                                }} >
                                    <input type="number"
                                        className="form-control mb-1"
                                        placeholder="Cantidad de boletos a comprar"
                                        ref={(input) => this._numBoletos = input} />

                                    <input type="submit"
                                        className="bbtn btn-block btn-primary btn-sm"
                                        value="COMPRAR BOLETOS" />
                                </form>
                                &nbsp;
                                <Container>
                                    <Row>
                                        <Col>
                                            <h3> Precio Boleto </h3>
                                            <form onSubmit={(event) => {
                                                event.preventDefault()
                                                this._precioBoleto()
                                            }}>
                                                <input type="submit"
                                                    className="bbtn btn-block btn-danger btn-sm"
                                                    value="PRECIO BOLETO" />
                                            </form>
                                        </Col>
                                        <Col>
                                            <h3> Tus Boletos </h3>
                                            <form onSubmit={(event) => {
                                                event.preventDefault()
                                                this._tusBoletos()
                                            }}>
                                                <input type="submit"
                                                    className="bbtn btn-block btn-success btn-sm"
                                                    value="TUS BOLETOS" />
                                            </form>
                                        </Col>
                                    </Row>
                                </Container>
                            </div>
                        </main>
                    </div>
                </div>
            </div>
        );
    }
}

export default Loteria;
