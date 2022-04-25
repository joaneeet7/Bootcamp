import React, { useState } from 'react';
import "./App.css";
import { create } from "ipfs-http-client";

// Cliente IPFS
const client = create("https://ipfs.infura.io:5001/api/v0");

const Home = () => {

    // Restablecimiento de variables
    const [file, setFile] = useState(null);
    // Estado inicial de la DApp (DApp con URLs de IPFS establecidas desde 0)
    const [urlArr, setUrlArr] = useState([]);

    // Carga de una imagen con uso de buffers
    const retrieveFile = (e) => {
        const data = e.target.files[0];
        const reader = new window.FileReader();
        reader.readAsArrayBuffer(data);
        reader.onloadend = () => {
            setFile(Buffer(reader.result));
        };
        e.preventDefault();
    };

    // Despliegue de la imagen en IPFS
    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const created = await client.add(file);
            console.log(created);
            const url = `https://ipfs.infura.io/ipfs/${created.path}`;
            console.log('URL en IPFS', url);
            setUrlArr((prev) => [...prev, url]);
        } catch (error) {
            console.log(error.message);
        }
    };

    return (
        <div className="App">
            <header className="App-header">DApp IPFS</header>
                <div className="main">
                    <form onSubmit={handleSubmit}>
                        <input type="file" onChange={retrieveFile} />
                        <button type="submit">Carga</button>
                    </form>
                </div>

                <div className="display">
                    {urlArr.length !== 0
                        ? urlArr.map((el) => <img src={el} alt="" />)
                        : <h3>Visualizar datos</h3>}
                </div>
        </div>
    );
};

export default Home;
