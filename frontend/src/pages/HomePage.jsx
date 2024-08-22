import { useState } from 'react';
import { Link } from 'react-router-dom';
import '../styles/Navbar.css';

const HomePage = () => {

    return (
        <div>
            <div className="user-container">
                <h1>Olá, nomeUsuário </h1>

                <div className="user-buttons">
                    <button id="user-launch-button">lançamentos</button>
                    <button id="user-simulation-button">simulação</button>
                </div>
            </div>
        </div>
    );
};

export default HomePage;