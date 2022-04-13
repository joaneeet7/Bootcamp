import React, { Component } from 'react';
import logo from '../logo.png';
import './App.css';

class App extends Component {
  render() {
    return (
      <div>
        <nav className="navbar navbar-dark fixed-top bg-dark flex-md-nowrap p-0 shadow">
          <a
            className="navbar-brand col-sm-3 col-md-2 mr-0"
            href="https://blockstellart.com"
            target="_blank"
            rel="noopener noreferrer"
          >
            DApp
          </a>
        </nav>
        <div className="container-fluid mt-5">
          <div className="row">
            <main role="main" className="col-lg-12 d-flex text-center">
              <div className="content mr-auto ml-auto">
                <a
                  href="https://blockstellart.com"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <img src={logo} className="App-logo" alt="" width="100%" height="50%" />
                </a>
                <h1>DApp (Autor: <a href="https://www.linkedin.com/in/joanamengual7/">Joan Amengual</a>)</h1>
                <p>
                  Edita <code>src/components/App.js</code> y guarda para recargar.
                </p>
                <a
                  className="App-link"
                  href="https://blockstellart.com"
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
