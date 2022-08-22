import React, { Component } from 'react';
import { BrowserRouter, Route, Routes } from "react-router-dom";

import Tokens from './Tokens';
import Footer from './Footer';
import Loteria from './Loteria';
import Ganador from './Ganador';

class App extends Component {
    
    render() {
        return (
            <BrowserRouter>
                <div className="App">
                    <div>
                        <Routes>
                            <Route path="/" element={<Tokens />} />
                            <Route path="/loteria" element={<Loteria />} />
                            <Route path="/ganador" element={<Ganador />} />
                        </Routes>
                    </div>
                    <Footer />
                </div>
            </BrowserRouter>
        );
    }

}

export default App;