import React, { Component } from 'react';
import JamToken from '../abis/JamToken.json';
import StellartToken from '../abis/StellartToken.json';
import TokenFarm from '../abis/TokenFarm.json';
import Web3 from 'web3';

import Navigation from './Navbar';
import MyCarousel from './Carousel';
import Main from './Main';

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

    // Carga del JamToken
    const jamTokenData = JamToken.networks[networkId]
    if (jamTokenData) {
      const jamToken = new web3.eth.Contract(JamToken.abi, jamTokenData.address)
      this.setState({ jamToken: jamToken })
      let jamTokenBalance = await jamToken.methods.balanceOf(this.state.account).call()
      this.setState({ jamTokenBalance: jamTokenBalance.toString() })
    } else {
      window.alert('El JamToken no se ha desplegado en la red')
    }

    // Carga de StellartToken
    const stellartTokenData = StellartToken.networks[networkId]
    if (stellartTokenData) {
      const stellartToken = new web3.eth.Contract(StellartToken.abi, stellartTokenData.address)
      this.setState({ stellartToken: stellartToken })
      let stellartTokenBalance = await stellartToken.methods.balanceOf(this.state.account).call()
      this.setState({ stellartTokenBalance: stellartTokenBalance.toString() })
    } else {
      window.alert('El StellartToken no se ha desplegado en la red')
    }

    // Carga de TokenFarm
    const tokenFarmData = TokenFarm.networks[networkId]
    if (tokenFarmData) {
      const tokenFarm = new web3.eth.Contract(TokenFarm.abi, tokenFarmData.address)
      this.setState({ tokenFarm: tokenFarm })
      let stakingBalance = await tokenFarm.methods.stakingBalance(this.state.account).call()
      this.setState({ stakingBalance: stakingBalance.toString() })
    } else {
      window.alert('El TokenFarm no se ha desplegado en la red')
    }
    this.setState({ loading: false })
  }

  stakeTokens = (amount) => {
    this.setState({ loading: true })
    this.state.jamToken.methods.approve(this.state.tokenFarm._address, amount)
      .send({ from: this.state.account })
      .on('transactionHash', (hash) => {
        this.state.tokenFarm.methods.stakeTokens(amount).send({ from: this.state.account })
          .on('transactionHash', (hash) => {
            this.setState({ loading: false })
          })
      })
  }

  unstakeTokens = (amount) => {
    this.setState({ loading: true })
    this.state.tokenFarm.methods.unstakeTokens().send({ from: this.state.account })
      .on('transactionHash', (hash) => {
        this.setState({ loading: false })
      })
  }

  constructor(props) {
    super(props)
    this.state = {
      account: '0x0',
      loading: true,
      jamToken: {},
      jamTokenBalance: '0',
      stellartToken: {},
      stellartTokenBalance: '0',
      tokenFarm: {},
      stakingBalance: '0',
    }
  }

  render() {

    let content
    if (this.state.loading) {
      content = <p id="loader" className='text-center'>Loading...</p>
    } else {
      content = <Main
        jamTokenBalance={this.state.jamTokenBalance}
        stellartTokenBalance={this.state.stellartTokenBalance}
        stakingBalance={this.state.stakingBalance}
        stakeTokens={this.stakeTokens}
        unstakeTokens={this.unstakeTokens}
      />
    }

    return (
      <div>
        <Navigation account={this.state.account} />
        <MyCarousel />
        <div className="container-fluid mt-5">
          <div className="row">
            <main role="main" className="col-lg-12 d-flex text-center">
              <div className="content mr-auto ml-auto">

                {content}

              </div>
            </main>
          </div>
        </div>
      </div>
    );
  }
}

export default App;
