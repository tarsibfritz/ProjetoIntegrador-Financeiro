import { useState } from 'react';
import { FaBars, FaTimes } from 'react-icons/fa';
import { Link, useNavigate } from 'react-router-dom'; // Importe useNavigate
import '../styles/Navbar.css';

const Navbar = () => {
    const [isOpen, setIsOpen] = useState(false);
    const navigate = useNavigate(); // Hook para navegação

    const toggleMenu = () => {
        setIsOpen(!isOpen);
    };

    const handleLogout = () => {
        localStorage.removeItem('token'); // Remove o token do armazenamento
        navigate('/login'); // Redireciona para a página de login
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
                    <button onClick={handleLogout} className="menu-item">Sair</button> {/* Adiciona o botão de logout */}
                </div>
            </div>
        </nav>
    );
};

export default Navbar;