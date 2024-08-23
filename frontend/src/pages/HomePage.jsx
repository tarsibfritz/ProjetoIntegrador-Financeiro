import { useState, useEffect } from 'react';
import '../styles/Home.css';

const HomePage = () => {
    const [userName, setUserName] = useState('');
    const [profilePic, setProfilePic] = useState(null);

    useEffect(() => {
        // Recupera o nome do usuário do localStorage
        const name = localStorage.getItem('userName');
        setUserName(name || 'Usuário');
    }, []);

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setProfilePic(reader.result);
            };
            reader.readAsDataURL(file);
        }
    };

    return (
        <div className="user-container">
            <div className="profile-section">
                <div className="profile-pic-container">
                    <input 
                        type="file" 
                        accept="image/*" 
                        id="profile-pic-input" 
                        onChange={handleFileChange}
                        style={{ display: 'none' }} // Oculta o input de arquivo
                    />
                    <label htmlFor="profile-pic-input">
                        <div className="profile-pic">
                            {profilePic ? (
                                <img src={profilePic} alt="Profile" className="profile-pic-img" />
                            ) : (
                                <div className="profile-pic-placeholder">+</div>
                            )}
                        </div>
                    </label>
                </div>
                <div className="profile-info">
                    <h1 id="user-welcome">Olá, {userName}</h1>
                    <div className="user-buttons">
                        <button id="user-launch-button">Lançamentos</button>
                        <button id="user-simulation-button">Simulação</button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default HomePage;