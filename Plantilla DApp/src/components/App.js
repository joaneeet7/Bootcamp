import React, { Component } from 'react';
import { BrowserRouter, Route, Routes } from "react-router-dom";

import Home from './Home';
import Footer from './Footer';

class App extends Component {
    
    render() {
        return (
            <BrowserRouter>
                <div className="App">
                    <div>
                        <Routes>
                            <Route path="/" element={<Home />} />
                        </Routes>
                    </div>
                    <Footer />
                </div>
            </BrowserRouter>
        );
    }

}

export default App;