import { useState, useEffect } from 'react';
import { FaUser } from 'react-icons/fa';
import { Link, useNavigate } from 'react-router-dom';
import '../styles/Navbar.css';

const Navbar = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [userName, setUserName] = useState('');
    const navigate = useNavigate();

    const toggleMenu = () => {
        setIsOpen(!isOpen);
    };

    const closeMenu = () => {
        setIsOpen(false);
    };

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('userName'); // Limpar o nome do usuário ao fazer logout
        navigate('/login');
        closeMenu();
    };

    useEffect(() => {
        // Obter o nome do usuário do localStorage
        const name = localStorage.getItem('userName');
        setUserName(name || 'Usuário');
    }, []);

    return (
        <nav className="navbar">
            <div className="navbar-content">
                <div className="navbar-left">
                    <h1 className="site-name">Financeiro</h1>
                </div>
                <div className="navbar-right">
                    <button className="menu-toggle" onClick={toggleMenu}>
                        <FaUser size={24} />
                    </button>
                    <div className={`menu ${isOpen ? 'open' : ''}`}>
                        <div className="user-info">
                            <span className="user-name">{userName}</span>
                        </div>
                        <Link to="/home" className="menu-item" onClick={closeMenu}>Home</Link>
                        <Link to="/lançamentos" className="menu-item" onClick={closeMenu}>Lançamentos</Link>
                        <button onClick={handleLogout} className="logout-user">Sair</button>
                    </div>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;