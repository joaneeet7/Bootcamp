import React, { Component } from 'react'

class Navbar extends Component {
    render() {
        return (
            <nav className="navbar navbar-dark fixed-top bg-dark flex-md-nowrap p-0 shadow">
                <a className="navbar-brand col-sm-3 col-md-2 mr-0"
                    href="https://blockstellart.com"
                    target="_blank"
                    rel="noopener noreferrer">
                    DApp
                </a>
                <span className="navbar-text">
                    <a href={`https://etherscan.io/address/${this.props.account}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="button nav-button btn-primary">
                            <p id="account">
                            {this.props.account.slice(0, 10) + '...' + this.props.account.slice(32, 42)}
                            </p>
                        </a>
                    </span>
            </nav>
        );
    }
}

export default Navbar;