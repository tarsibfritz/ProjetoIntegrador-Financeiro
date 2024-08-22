import { useState } from 'react';
import { FaBars, FaTimes } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import '../styles/Navbar.css';

const Navbar = () => {
    const [isOpen, setIsOpen] = useState(false);

    const toggleMenu = () => {
        setIsOpen(!isOpen);
    };

    return (
        <nav className="navbar">
            <div className="navbar-left">
                <h1 className="site-name">Nome do Site</h1>
            </div>
            <div className="navbar-right">
                <button className="menu-toggle" onClick={toggleMenu}>
                    {isOpen ? <FaTimes size={24} /> : <FaBars size={24} />}
                </button>
                <div className={`menu ${isOpen ? 'open' : ''}`}>
                    <Link to="/lançamentos" className="menu-item">Lançamentos</Link>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;