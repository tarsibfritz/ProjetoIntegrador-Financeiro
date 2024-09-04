import { useState } from "react";
import { toast } from 'react-toastify';
import { Link } from 'react-router-dom';
import { resetPassword } from '../services/userService';
import "../styles/ResetPassword.css";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';

const ResetPassword = () => {
    const [email, setEmail] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [showNewPassword, setShowNewPassword] = useState(false); // Estado para mostrar/ocultar nova senha
    const [showConfirmPassword, setShowConfirmPassword] = useState(false); // Estado para mostrar/ocultar confirmar senha

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!email || !newPassword || !confirmPassword) {
            toast.info("Todos os campos são obrigatórios!");
            return;
        }

        if (newPassword !== confirmPassword) {
            toast.warning("As senhas não coincidem!");
            return;
        }

        try {
            await resetPassword(email, newPassword);
            toast.success("Senha redefinida com sucesso!");
            // Redirecionar ou limpar os campos conforme necessário
        } catch (error) {
            toast.error("Erro ao redefinir a senha. Tente novamente.");
        }
    };

    return (
        <div className="reset-password">
            <form onSubmit={handleSubmit}>
                <div className="reset-password-container">
                    <h2 className="reset-password-title">Redefinir Senha</h2>
                    <div className="reset-password-content">
                        <div className="reset-password-group">
                            <label>Email</label>
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="exemplo@exemplo.com"
                                required
                            />
                        </div>
                        <div className="reset-password-group password-group">
                            <label>Nova Senha</label>
                            <div className="password-container">
                                <input
                                    type={showNewPassword ? "text" : "password"}
                                    value={newPassword}
                                    onChange={(e) => setNewPassword(e.target.value)}
                                    required
                                />
                                <FontAwesomeIcon
                                    icon={showNewPassword ? faEyeSlash : faEye}
                                    className="password-toggle"
                                    onClick={() => setShowNewPassword(!showNewPassword)}
                                />
                            </div>
                        </div>
                        <div className="reset-password-group password-group">
                            <label>Confirmar Senha</label>
                            <div className="password-container">
                                <input
                                    type={showConfirmPassword ? "text" : "password"}
                                    value={confirmPassword}
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                    required
                                />
                                <FontAwesomeIcon
                                    icon={showConfirmPassword ? faEyeSlash : faEye}
                                    className="password-toggle"
                                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                />
                            </div>
                        </div>
                        <button className="reset-password-button" type="submit">Redefinir Senha</button>
                    </div>
                    <Link to='/login' className="back-button">Voltar</Link>
                </div>
            </form>
        </div>
    );
};

export default ResetPassword;